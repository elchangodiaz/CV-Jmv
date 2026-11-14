import { computed, ref, watch } from 'vue'
import es from '../content/es.js'
import en from '../content/en.js'
import creativeEs from '../content/creative.es.js'
import creativeEn from '../content/creative.en.js'
import aiEs from '../content/ai.es.js'
import aiEn from '../content/ai.en.js'

const messages = {
  es: { ...es, creative: creativeEs, ai: aiEs },
  en: { ...en, creative: creativeEn, ai: aiEn }
}
const SUPPORTED = Object.keys(messages)

function readStorage(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Modo privado o almacenamiento bloqueado: no pasa nada.
  }
}

// Prioridad: idioma en la URL (/es o /en), luego la última elección, luego el navegador.
function detectLocale() {
  const fromPath = window.location.pathname.split('/')[1]
  if (SUPPORTED.includes(fromPath)) return fromPath

  const saved = readStorage('lang')
  if (SUPPORTED.includes(saved)) return saved

  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

const locale = ref(detectLocale())
const content = computed(() => messages[locale.value])

function setMeta(selector, value) {
  document.querySelector(selector)?.setAttribute('content', value)
}

watch(
  locale,
  (lang) => {
    const { meta } = messages[lang]
    document.documentElement.lang = lang
    document.title = meta.title
    setMeta('meta[name="description"]', meta.description)
    setMeta('meta[property="og:title"]', meta.title)
    setMeta('meta[property="og:description"]', meta.description)
    window.history.replaceState(null, '', `/${lang}${window.location.search}${window.location.hash}`)
    writeStorage('lang', lang)
  },
  { immediate: true }
)

export function useLocale() {
  const setLocale = (lang) => {
    if (SUPPORTED.includes(lang)) locale.value = lang
  }
  return { locale, content, setLocale, locales: SUPPORTED }
}
