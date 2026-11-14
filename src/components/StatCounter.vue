<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

// Cuenta de 0 al valor la primera vez que aparece en pantalla. Acepta valores como '5,000+'.
const props = defineProps({
  value: { type: String, required: true },
  label: { type: String, required: true }
})

const root = ref(null)
const display = ref(props.value)
let observer
let frame

function parse(value) {
  const match = value.match(/^([\d,]+)(.*)$/)
  if (!match) return null
  return { target: Number(match[1].replace(/,/g, '')), suffix: match[2] }
}

function animate() {
  const parsed = parse(props.value)
  if (!parsed) return
  const duration = 1200
  const start = performance.now()
  const step = (now) => {
    const progress = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - progress, 3)
    display.value = Math.round(parsed.target * eased).toLocaleString('en-US') + parsed.suffix
    if (progress < 1) frame = requestAnimationFrame(step)
  }
  frame = requestAnimationFrame(step)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const parsed = parse(props.value)
  if (!parsed) return
  display.value = '0' + parsed.suffix
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        animate()
        observer.disconnect()
      }
    },
    { threshold: 0.5 }
  )
  observer.observe(root.value)
})

watch(
  () => props.value,
  (value) => {
    display.value = value
  }
)

onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
})
</script>

<template>
  <div ref="root" class="stat">
    <span class="stat-value" aria-hidden="true">{{ display }}</span>
    <span class="visually-hidden">{{ value }}</span>
    <span class="stat-label">{{ label }}</span>
  </div>
</template>

<style scoped>
.stat {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1.25rem;
  border-radius: 10px;
  background: var(--card-head);
  border: 1px solid transparent;
  transition: border-color 0.3s, transform 0.3s;
}

.stat:hover {
  border-color: rgba(255, 255, 255, 0.35);
  transform: translateY(-3px);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--text-muted);
}
</style>
