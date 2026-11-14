import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useLocale } from './useLocale.js'

// Estado compartido entre secciones: la habilidad seleccionada y los puestos abiertos.
const selectedSkill = ref(null)
const expanded = reactive(new Set(['gs-senior']))
const flashedJob = ref(null)

// Los nombres de habilidades cambian con el idioma, así que el filtro se limpia al cambiarlo.
watch(useLocale().locale, () => {
  selectedSkill.value = null
})

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useCvState() {
  const { content } = useLocale()

  // Habilidad -> puestos donde aparece, según las listas "tech" de cada puesto.
  const jobsBySkill = computed(() => {
    const map = new Map()
    for (const job of content.value.experience) {
      for (const tech of job.tech) {
        if (!map.has(tech)) map.set(tech, [])
        map.get(tech).push(job)
      }
    }
    return map
  })

  const isLinkedSkill = (skill) => jobsBySkill.value.has(skill)

  const selectSkill = (skill) => {
    selectedSkill.value = selectedSkill.value === skill ? null : skill
    if (selectedSkill.value) {
      for (const job of jobsBySkill.value.get(skill) ?? []) expanded.add(job.id)
    }
  }

  const clearSkill = () => {
    selectedSkill.value = null
  }

  const jobMatches = (job) => !selectedSkill.value || job.tech.includes(selectedSkill.value)

  const toggleJob = (id) => {
    if (expanded.has(id)) expanded.delete(id)
    else expanded.add(id)
  }

  // Abre un puesto, lo lleva a la vista y lo resalta brevemente.
  const focusJob = async (id) => {
    expanded.add(id)
    await nextTick()
    const el = document.getElementById(`job-${id}`)
    if (!el) return
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' })
    flashedJob.value = id
    setTimeout(() => {
      if (flashedJob.value === id) flashedJob.value = null
    }, 1600)
  }

  const focusSection = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  }

  return {
    selectedSkill,
    expanded,
    flashedJob,
    jobsBySkill,
    isLinkedSkill,
    selectSkill,
    clearSkill,
    jobMatches,
    toggleJob,
    focusJob,
    focusSection
  }
}
