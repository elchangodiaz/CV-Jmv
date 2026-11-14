<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useLocale } from '../../composables/useLocale.js'

const { content } = useLocale()
const t = computed(() => content.value.creative.mtb)

// ---------- Terreno: rampa de salida, hueco y rampa de aterrizaje ----------
// La parábola del vuelo sale con la misma pendiente que la rampa y cae justo
// al inicio de la rampa de aterrizaje, que es su reflejo: el aterrizaje es suave.
const G = 232 // nivel del suelo
const H = 52 // altura de las rampas
const L = 92 // largo de cada rampa
const RISE = 78 // altura del vuelo sobre el borde de la rampa
const K0 = 120
const K1 = K0 + L
const SLOPE = (2 * H) / L
const A = (SLOPE * SLOPE) / (4 * RISE)
const GAP = SLOPE / A
const LS = K1 + GAP
const LE = LS + L
const START = -70
const END = 790
const SPEED = 210 // px por segundo
const WHEEL_R = 14

function path(x) {
  if (x > K0 && x <= K1) {
    const u = (x - K0) / L
    return { y: G - H * u * u, dy: (-2 * H * u) / L, air: false }
  }
  if (x > K1 && x < LS) {
    const d = x - K1
    return { y: G - H - SLOPE * d + A * d * d, dy: -SLOPE + 2 * A * d, air: true, p: d / GAP }
  }
  if (x >= LS && x < LE) {
    const v = (x - LS) / L
    return { y: G - H * (1 - v) * (1 - v), dy: (2 * H * (1 - v)) / L, air: false }
  }
  return { y: G, dy: 0, air: false }
}

// Altura del terreno bajo la bici (para la sombra durante el vuelo).
function groundAt(x) {
  if (x > K0 && x <= K1) return G - H * ((x - K0) / L) ** 2
  if (x >= LS && x < LE) return G - H * (1 - (x - LS) / L) ** 2
  return G
}

const terrain = `M0 ${G} L${K0} ${G} Q${K0 + L * 0.5} ${G} ${K1} ${G - H} L${K1 + 6} ${G - H} L${K1 + 6} ${G}
  L${LS - 6} ${G} L${LS - 6} ${G - H} L${LS} ${G - H} Q${LS + L * 0.5} ${G} ${LE} ${G} L720 ${G} L720 300 L0 300 Z`

const ease = (p) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2)

// Cada truco devuelve la transformación extra del cuadro en función del avance en el aire.
const tricks = {
  none: () => '',
  whip: (p) => `rotate(${-28 * Math.sin(Math.PI * p)}) scale(1 ${1 - 0.45 * Math.sin(Math.PI * p)})`,
  spin: (p) => `scale(${Math.cos(2 * Math.PI * ease(p)) || 0.001} 1)`,
  backflip: (p) => `rotate(${-360 * ease(p)})`
}
const trickIds = Object.keys(tricks)

const trick = ref('whip')
const random = ref(false)
const playing = ref(true)
const jumps = ref(0)
const state = reactive({ x: START, y: G, angle: 0, extra: '', spin: 0, shadowY: G, shadowScale: 1 })
const particles = ref([])
let currentTrick = 'whip'
let wasAir = false
let raf = 0
let last = 0
let seq = 0

function step(now) {
  const dt = Math.min(0.05, (now - (last || now)) / 1000)
  last = now
  let x = state.x + SPEED * dt
  if (x > END) {
    x = START
    currentTrick = random.value ? trickIds[1 + Math.floor(Math.random() * (trickIds.length - 1))] : trick.value
  }
  const p = path(x)
  state.x = x
  state.y = p.y
  state.angle = (Math.atan(p.dy) * 180) / Math.PI
  state.extra = p.air ? tricks[currentTrick](p.p) : ''
  state.spin = ((x / WHEEL_R) * 180) / Math.PI
  state.shadowY = groundAt(x)
  state.shadowScale = Math.max(0.35, 1 - (state.shadowY - p.y) / 160)

  // Polvo al despegar y al aterrizar.
  if (p.air !== wasAir) {
    if (!p.air) jumps.value++
    for (let i = 0; i < 9; i++) {
      particles.value.push({
        id: ++seq,
        x: x + (Math.random() - 0.5) * 30,
        y: p.y - 2,
        vx: (Math.random() - 0.3) * 70,
        vy: -Math.random() * 60 - 10,
        life: 1
      })
    }
  }
  wasAir = p.air
  particles.value = particles.value
    .map((d) => ({ ...d, x: d.x + d.vx * dt, y: d.y + d.vy * dt, vy: d.vy + 120 * dt, life: d.life - dt * 1.6 }))
    .filter((d) => d.life > 0)

  raf = requestAnimationFrame(step)
}

function play() {
  playing.value = true
  last = 0
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(step)
}

function pause() {
  playing.value = false
  cancelAnimationFrame(raf)
}

function chooseTrick(id) {
  trick.value = id
  random.value = false
  // Si la bici todavía no despega, el truco aplica en este mismo salto.
  if (state.x < K1) currentTrick = id
}

function chooseRandom() {
  random.value = true
}

const onVisibility = () => document.hidden && pause()

onMounted(() => {
  currentTrick = trick.value
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    // Sin animación: se muestra la bici en pleno vuelo.
    state.x = K1 + GAP / 2
    Object.assign(state, { y: path(state.x).y, angle: 0, extra: tricks.whip(0.5) })
    state.shadowY = G
    state.shadowScale = 0.5
    playing.value = false
  } else {
    play()
  }
  document.addEventListener('visibilitychange', onVisibility)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <div class="mtb">
    <div class="head">
      <div>
        <h3>{{ t.title }}</h3>
        <p class="description">{{ t.description }}</p>
      </div>
      <p class="counter" aria-live="polite">{{ t.jumps(jumps) }}</p>
    </div>

    <svg class="scene" viewBox="0 0 720 300" role="img" :aria-label="t.sceneLabel">
      <defs>
        <linearGradient id="mtb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#9966ff" />
          <stop offset="0.6" stop-color="#ff9f40" />
          <stop offset="1" stop-color="#ffce56" />
        </linearGradient>
        <linearGradient id="mtb-dirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#8a5a3c" />
          <stop offset="1" stop-color="#4e3122" />
        </linearGradient>
      </defs>

      <rect width="720" height="300" fill="url(#mtb-sky)" />
      <circle cx="600" cy="92" r="34" fill="#fff4c2" opacity="0.9" />
      <path d="M0 200 L90 120 L170 175 L260 95 L360 170 L450 110 L560 180 L650 125 L720 160 L720 300 L0 300 Z" fill="#5b4a8a" opacity="0.55" />
      <path d="M0 215 L60 180 L150 205 L230 170 L330 210 L430 175 L520 205 L620 178 L720 200 L720 300 L0 300 Z" fill="#3f3466" opacity="0.7" />

      <!-- Pinos -->
      <g fill="#2a2347">
        <path v-for="tx in [30, 70, 610, 660, 700]" :key="tx" :d="`M${tx} ${G} l-14 0 l14 -46 l14 46 Z`" />
      </g>

      <path :d="terrain" fill="url(#mtb-dirt)" />
      <path :d="`M0 ${G} L720 ${G}`" stroke="#3a2418" stroke-width="2" opacity="0.4" />

      <ellipse
        :cx="state.x"
        :cy="state.shadowY + 1"
        :rx="34 * state.shadowScale"
        :ry="4 * state.shadowScale"
        fill="#000"
        opacity="0.25"
      />

      <circle
        v-for="d in particles"
        :key="d.id"
        :cx="d.x"
        :cy="d.y"
        :r="2 + 3 * (1 - d.life)"
        fill="#d9b48f"
        :opacity="d.life * 0.8"
      />

      <!-- Bici y rider: el origen es el punto de contacto con el suelo -->
      <g :transform="`translate(${state.x} ${state.y}) rotate(${state.angle})`">
        <g :transform="`translate(0 -34) ${state.extra} translate(0 34)`">
          <g class="wheel" v-for="wx in [-24, 24]" :key="wx" :transform="`translate(${wx} -${WHEEL_R}) rotate(${state.spin})`">
            <circle :r="WHEEL_R" fill="none" stroke="#111" stroke-width="4" />
            <circle :r="WHEEL_R - 3" fill="none" stroke="#555" stroke-width="1" />
            <path d="M-11 0 H11 M0 -11 V11 M-8 -8 L8 8 M-8 8 L8 -8" stroke="#bbb" stroke-width="0.8" />
            <circle r="2" fill="#ddd" />
          </g>
          <g stroke-linecap="round" stroke-linejoin="round" fill="none">
            <!-- Cuadro -->
            <path d="M-24 -14 L-2 -12 L-10 -34 Z M-2 -12 L15 -35 L-10 -34" stroke="#36a2eb" stroke-width="3.5" />
            <path d="M15 -35 L24 -14" stroke="#ddd" stroke-width="3.5" />
            <path d="M15 -35 L13 -42 M8 -43 H19" stroke="#222" stroke-width="3" />
            <path d="M-13 -36 H-6" stroke="#222" stroke-width="3.5" />
            <!-- Rider -->
            <path d="M-4 -12 L5 -28 L-12 -44" stroke="#2b2b2b" stroke-width="5" />
            <path d="M-12 -44 L3 -61" stroke="#ff6384" stroke-width="8" />
            <path d="M3 -61 L11 -52 L15 -43" stroke="#ff6384" stroke-width="4" />
          </g>
          <circle cx="10" cy="-69" r="6.5" fill="#f1c7a1" />
          <path d="M2 -70 A8.5 8.5 0 0 1 18 -72 L20 -69 Z" fill="#ffce56" />
          <path d="M14 -70 L22 -68" stroke="#333" stroke-width="2" stroke-linecap="round" />
        </g>
      </g>
    </svg>

    <div class="controls">
      <div class="tricks" role="group" :aria-label="t.trickLabel">
        <button
          v-for="id in trickIds"
          :key="id"
          type="button"
          class="pill"
          :aria-pressed="!random && trick === id"
          @click="chooseTrick(id)"
        >
          {{ t.tricks[id] }}
        </button>
        <button type="button" class="pill" :aria-pressed="random" @click="chooseRandom">🎲 {{ t.random }}</button>
      </div>
      <button type="button" class="pill play" @click="playing ? pause() : play()">
        {{ playing ? '❚❚ ' + t.pause : '▶ ' + t.play }}
      </button>
    </div>
    <p class="note">{{ t.note }}</p>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

h3 {
  margin: 0 0 0.35rem;
  font-size: 1.15rem;
}

.description {
  max-width: 65ch;
  margin: 0 0 1.25rem;
  color: var(--text-soft);
}

.counter {
  margin: 0;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: var(--card-head);
  color: var(--c-yellow);
  font-weight: 700;
  white-space: nowrap;
}

.scene {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1rem;
}

.tricks {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pill {
  padding: 0.45rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  background: var(--chip-bg);
  color: var(--text-soft);
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.pill:hover {
  border-color: #fff;
}

.pill[aria-pressed='true'] {
  border-color: var(--c-teal);
  background: var(--c-teal);
  color: #12202a;
}

.play {
  min-width: 7.5rem;
}

.note {
  margin: 0.9rem 0 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
