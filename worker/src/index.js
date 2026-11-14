// Servidor de la IA del CV (Cloudflare Worker con Workers AI).
// El sitio es estático y no puede guardar credenciales, así que las llamadas a la IA pasan por aquí.
import es from '../../src/content/es.js'
import en from '../../src/content/en.js'
import orgNames from '../../src/content/orgNames.js'
import links from '../../src/content/links.js'
import { allSkills, buildCvText } from '../../src/ai/cvText.js'
import { chatPrompt, matchPrompt } from './prompts.js'

const CV = { es: buildCvText(es, orgNames, links), en: buildCvText(en, orgNames, links) }
const SKILLS = { es: allSkills(es), en: allSkills(en) }

const LIMITS = {
  question: 600, // caracteres por pregunta
  answer: 2000, // caracteres por respuesta previa reenviada como historial
  history: 8, // mensajes de historial que se reenvían
  job: 8000, // caracteres de la vacante
  jobMin: 40,
  body: 20000 // bytes por solicitud
}

const DEFAULT_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'

class HttpError extends Error {
  constructor(status, code) {
    super(code)
    this.status = status
    this.code = code
  }
}

function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS ?? '').split(',').map((o) => o.trim())
  if (!origin || !allowed.includes(origin)) return null
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  }
}

const json = (body, status, cors) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...cors }
  })

function parseLang(lang) {
  if (lang !== 'es' && lang !== 'en') throw new HttpError(400, 'bad_request')
  return lang
}

async function runModel(env, messages, options) {
  try {
    return await env.AI.run(env.MODEL || DEFAULT_MODEL, { messages, ...options })
  } catch (error) {
    // Al agotarse la cuota gratuita del día, Workers AI responde con el código 4006.
    if (/4006|daily free allocation|neurons/i.test(String(error?.message))) throw new HttpError(429, 'quota')
    console.error('AI error', error?.message)
    throw new HttpError(502, 'ai')
  }
}

// ---------- Pregúntale a mi CV ----------
async function handleChat(body, env) {
  const lang = parseLang(body.lang)
  const messages = Array.isArray(body.messages) ? body.messages.slice(-LIMITS.history) : []
  const last = messages[messages.length - 1]
  if (!last || last.role !== 'user') throw new HttpError(400, 'bad_request')

  const clean = messages.map((m) => {
    if ((m?.role !== 'user' && m?.role !== 'assistant') || typeof m.content !== 'string') {
      throw new HttpError(400, 'bad_request')
    }
    const content = m.content.trim()
    if (!content) throw new HttpError(400, 'bad_request')
    if (content.length > (m.role === 'user' ? LIMITS.question : LIMITS.answer)) throw new HttpError(413, 'too_long')
    return { role: m.role, content }
  })
  // El historial debe empezar con una pregunta.
  while (clean.length && clean[0].role !== 'user') clean.shift()

  const result = await runModel(env, [{ role: 'system', content: chatPrompt(lang, CV[lang]) }, ...clean], {
    max_tokens: 400,
    temperature: 0.3
  })
  const answer = typeof result?.response === 'string' ? result.response.trim() : ''
  if (!answer) throw new HttpError(502, 'ai')
  return { answer }
}

// ---------- ¿Encajo en tu vacante? ----------
function extractJson(value) {
  if (value && typeof value === 'object') return value
  const text = String(value ?? '')
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end <= start) return null
  try {
    return JSON.parse(text.slice(start, end + 1))
  } catch {
    return null
  }
}

const clip = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

// Todo lo que devuelve el modelo se valida antes de mandarlo al navegador.
export function sanitizeMatch(raw, lang) {
  const known = new Map(SKILLS[lang].map((s) => [s.toLowerCase(), s]))
  const fit = ['high', 'medium', 'low'].includes(raw?.fit) ? raw.fit : 'medium'
  const requirements = (Array.isArray(raw?.requirements) ? raw.requirements : [])
    .slice(0, 8)
    .map((r) => ({
      requirement: clip(r?.requirement, 160),
      status: ['yes', 'partial', 'no'].includes(r?.status) ? r.status : 'no',
      evidence: clip(r?.evidence, 240)
    }))
    .filter((r) => r.requirement)
  const skills = [
    ...new Set(
      (Array.isArray(raw?.skills) ? raw.skills : [])
        .map((s) => known.get(String(s).trim().toLowerCase()))
        .filter(Boolean)
    )
  ]
  return { fit, summary: clip(raw?.summary, 600), requirements, skills }
}

async function handleMatch(body, env) {
  const lang = parseLang(body.lang)
  const job = typeof body.job === 'string' ? body.job.trim() : ''
  if (job.length < LIMITS.jobMin) throw new HttpError(400, 'too_short')
  if (job.length > LIMITS.job) throw new HttpError(413, 'too_long')

  const messages = [
    { role: 'system', content: matchPrompt(lang, CV[lang], SKILLS[lang]) },
    { role: 'user', content: `<job_posting>\n${job}\n</job_posting>` }
  ]
  const result = await runModel(env, messages, { max_tokens: 900, temperature: 0.1 })
  const parsed = extractJson(result?.response)
  if (!parsed) throw new HttpError(502, 'ai')
  return sanitizeMatch(parsed, lang)
}

const routes = { '/api/chat': handleChat, '/api/match': handleMatch }

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const cors = corsHeaders(request.headers.get('Origin'), env)
    if (!cors) return json({ error: 'forbidden' }, 403, {})
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })

    const handler = routes[url.pathname]
    if (!handler) return json({ error: 'not_found' }, 404, cors)
    if (request.method !== 'POST') return json({ error: 'method' }, 405, cors)

    try {
      // Límite por visitante: unas cuantas solicitudes por minuto.
      if (env.LIMITER) {
        const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown'
        const { success } = await env.LIMITER.limit({ key: ip })
        if (!success) throw new HttpError(429, 'rate_limited')
      }
      const raw = await request.text()
      if (raw.length > LIMITS.body) throw new HttpError(413, 'too_long')
      let body
      try {
        body = JSON.parse(raw)
      } catch {
        throw new HttpError(400, 'bad_request')
      }
      return json(await handler(body ?? {}, env), 200, cors)
    } catch (error) {
      if (error instanceof HttpError) return json({ error: error.code }, error.status, cors)
      console.error(error)
      return json({ error: 'server' }, 500, cors)
    }
  }
}
