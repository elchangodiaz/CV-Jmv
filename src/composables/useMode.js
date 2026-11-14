import { ref, watch } from 'vue'

// Modo de presentación: 'formal' (predeterminado, para reclutadores) o 'creative'.
const MODES = ['formal', 'creative']

function detectMode() {
  const fromQuery = new URLSearchParams(window.location.search).get('mode')
  if (MODES.includes(fromQuery)) return fromQuery
  try {
    const saved = localStorage.getItem('mode')
    if (MODES.includes(saved)) return saved
  } catch {
    // Almacenamiento bloqueado.
  }
  return 'formal'
}

const mode = ref(detectMode())

watch(
  mode,
  (value) => {
    document.documentElement.dataset.mode = value
    try {
      localStorage.setItem('mode', value)
    } catch {
      // Almacenamiento bloqueado: el modo solo dura esta visita.
    }
    // Mantiene la URL compartible: ?mode=creative solo en modo creativo.
    const url = new URL(window.location.href)
    if (value === 'creative') url.searchParams.set('mode', 'creative')
    else url.searchParams.delete('mode')
    window.history.replaceState(null, '', url)
  },
  { immediate: true }
)

export function useMode() {
  const setMode = (value) => {
    if (MODES.includes(value)) mode.value = value
  }
  return { mode, modes: MODES, setMode }
}
