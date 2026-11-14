// Cliente del servidor de la IA (worker/). La URL se configura en VITE_AI_URL.
const AI_URL = (import.meta.env.VITE_AI_URL ?? '').replace(/\/$/, '')
const TIMEOUT_MS = 30000

export const aiEnabled = Boolean(AI_URL)

export class AiError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

async function post(path, body) {
  if (!aiEnabled) throw new AiError('disabled')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const response = await fetch(`${AI_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new AiError(data.error ?? 'server')
    return data
  } catch (error) {
    if (error instanceof AiError) throw error
    throw new AiError(error?.name === 'AbortError' ? 'timeout' : 'network')
  } finally {
    clearTimeout(timer)
  }
}

export const askCv = (lang, messages) => post('/api/chat', { lang, messages })
export const matchJob = (lang, job) => post('/api/match', { lang, job })
