import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

// Marca como activa la última sección cuyo inicio ya pasó el 35% superior de la pantalla.
// Se calcula por posición en cada scroll, así también detecta secciones que se cargan después.
export function useScrollSpy(idsRef) {
  const activeId = ref(null)
  let frame = 0

  const update = () => {
    frame = 0
    const line = window.innerHeight * 0.35
    let current = idsRef.value[0] ?? null
    for (const id of idsRef.value) {
      const el = document.getElementById(id)
      if (el && el.getBoundingClientRect().top <= line) current = id
    }
    // Al llegar al final de la página se activa la última sección.
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
    if (atBottom) current = idsRef.value[idsRef.value.length - 1] ?? current
    activeId.value = current
  }

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }

  onMounted(() => {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    update()
  })

  // Las secciones del modo creativo tardan un momento en montarse.
  watch(idsRef, () => setTimeout(schedule, 300))

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    cancelAnimationFrame(frame)
  })

  return { activeId }
}
