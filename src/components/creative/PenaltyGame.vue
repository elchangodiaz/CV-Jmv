<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useLocale } from '../../composables/useLocale.js'

const { content } = useLocale()
const t = computed(() => content.value.creative.soccer)

// ---------- Geometría de la portería (coordenadas del SVG) ----------
const GOAL = { left: 150, right: 450, top: 70, bottom: 210 }
const SPOT = { x: 300, y: 330 }
const KEEPER = { x: 300, y: 150 }
const POST = 6 // grosor del poste: si el balón cae en él, rebota
const REACH = 52 // alcance del portero desde el centro de su estirada
const SHOTS = 5
const BEST_KEY = 'penalty-best'

// A dónde se lanza el portero en cada zona, y con qué giro.
const DIVES = {
  'left-high': { x: 205, y: 112, r: -70 },
  'left-low': { x: 200, y: 185, r: -85 },
  'center-high': { x: 300, y: 108, r: 0 },
  'center-low': { x: 300, y: 165, r: 0 },
  'right-high': { x: 395, y: 112, r: 70 },
  'right-low': { x: 400, y: 185, r: 85 }
}
const ZONES = Object.keys(DIVES)

function zoneOf(point) {
  const col = point.x < 245 ? 'left' : point.x > 355 ? 'right' : 'center'
  return `${col}-${point.y < 140 ? 'high' : 'low'}`
}

// ---------- Estado ----------
const phase = ref('aim') // aim → power → shot → result → (aim | over)
const aim = ref({ x: 300, y: 130 })
const meter = ref(0)
const ball = ref({ x: SPOT.x, y: SPOT.y, scale: 1, spin: 0 })
const keeper = ref({ x: KEEPER.x, y: KEEPER.y, r: 0 })
const results = ref([])
const message = ref('')
const best = ref(Number(localStorage.getItem(BEST_KEY)) || 0)
const svg = ref(null)

const goals = computed(() => results.value.filter((r) => r === 'goal').length)
const isLast = computed(() => results.value.length >= SHOTS)

let raf = 0
let timer = 0
let meterStart = 0

// ---------- Apuntar ----------
const clampAim = (p) => ({
  x: Math.min(GOAL.right + 30, Math.max(GOAL.left - 30, p.x)),
  y: Math.min(GOAL.bottom - 8, Math.max(GOAL.top - 30, p.y))
})

function toSvg(event) {
  const pt = svg.value.createSVGPoint()
  pt.x = event.clientX
  pt.y = event.clientY
  return pt.matrixTransform(svg.value.getScreenCTM().inverse())
}

function onPointerMove(event) {
  if (phase.value === 'aim') aim.value = clampAim(toSvg(event))
}

function onPointerDown(event) {
  if (phase.value === 'aim') {
    aim.value = clampAim(toSvg(event))
    startMeter()
  } else if (phase.value === 'power') {
    shoot()
  }
}

function onKeydown(event) {
  const moves = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] }
  if (phase.value === 'aim' && moves[event.key]) {
    event.preventDefault()
    const [dx, dy] = moves[event.key]
    aim.value = clampAim({ x: aim.value.x + dx, y: aim.value.y + dy })
  } else if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    if (phase.value === 'aim') startMeter()
    else if (phase.value === 'power') shoot()
  }
}

// ---------- Barra de precisión: oscila y el centro es el tiro perfecto ----------
function startMeter() {
  phase.value = 'power'
  meterStart = performance.now()
  // Cada gol acelera un poco la barra.
  const period = Math.max(650, 1300 - goals.value * 120)
  const tick = (now) => {
    const p = ((now - meterStart) / period) % 2
    meter.value = p < 1 ? p : 2 - p
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}

function shoot() {
  cancelAnimationFrame(raf)
  phase.value = 'shot'

  const accuracy = 1 - Math.abs(meter.value - 0.5) * 2
  const spread = (1 - accuracy) * 85
  const angle = Math.random() * Math.PI * 2
  const target = { x: aim.value.x + Math.cos(angle) * spread, y: aim.value.y + Math.sin(angle) * spread * 0.7 }

  // El portero adivina la zona real con más probabilidad conforme metes goles.
  const read = Math.min(0.6, 0.28 + goals.value * 0.08)
  const zone = Math.random() < read ? zoneOf(aim.value) : ZONES[Math.floor(Math.random() * ZONES.length)]
  const dive = DIVES[zone]

  const start = performance.now()
  const duration = 620
  const animate = (now) => {
    const p = Math.min(1, (now - start) / duration)
    const e = 1 - (1 - p) ** 2
    ball.value = {
      x: SPOT.x + (target.x - SPOT.x) * e,
      y: SPOT.y + (target.y - SPOT.y) * e - Math.sin(Math.PI * p) * 28,
      scale: 1 - 0.5 * e,
      spin: p * 540
    }
    // El portero reacciona un instante después del disparo.
    const k = Math.max(0, Math.min(1, (p - 0.12) / 0.7))
    const ke = 1 - (1 - k) ** 3
    keeper.value = {
      x: KEEPER.x + (dive.x - KEEPER.x) * ke,
      y: KEEPER.y + (dive.y - KEEPER.y) * ke,
      r: dive.r * ke
    }
    if (p < 1) raf = requestAnimationFrame(animate)
    else resolve(target, dive)
  }
  raf = requestAnimationFrame(animate)
}

function resolve(target, dive) {
  const inside = target.x > GOAL.left && target.x < GOAL.right && target.y > GOAL.top && target.y < GOAL.bottom
  const onPost =
    target.y > GOAL.top - POST &&
    target.y < GOAL.bottom &&
    (Math.abs(target.x - GOAL.left) < POST || Math.abs(target.x - GOAL.right) < POST)
  const onBar = Math.abs(target.y - GOAL.top) < POST && target.x > GOAL.left - POST && target.x < GOAL.right + POST
  const nearPost = !inside && (onPost || onBar)
  const saved = inside && Math.hypot(target.x - dive.x, target.y - dive.y) < REACH

  let outcome = 'miss'
  if (saved) outcome = 'save'
  else if (inside) outcome = 'goal'
  else if (nearPost) outcome = 'post'

  results.value = [...results.value, outcome === 'goal' ? 'goal' : 'miss']
  message.value = t.value.outcomes[outcome]
  phase.value = 'result'

  if (isLast.value && goals.value > best.value) {
    best.value = goals.value
    localStorage.setItem(BEST_KEY, String(best.value))
  }

  timer = setTimeout(() => {
    if (isLast.value) {
      phase.value = 'over'
      return
    }
    resetShot()
  }, 1400)
}

function resetShot() {
  ball.value = { x: SPOT.x, y: SPOT.y, scale: 1, spin: 0 }
  keeper.value = { x: KEEPER.x, y: KEEPER.y, r: 0 }
  message.value = ''
  meter.value = 0
  phase.value = 'aim'
}

function restart() {
  clearTimeout(timer)
  cancelAnimationFrame(raf)
  results.value = []
  resetShot()
}

const hint = computed(() => {
  if (phase.value === 'aim') return t.value.hintAim
  if (phase.value === 'power') return t.value.hintPower
  return ''
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearTimeout(timer)
})
</script>

<template>
  <div class="penalty">
    <h3>{{ t.title }}</h3>
    <p class="description">{{ t.description }}</p>

    <div class="board">
      <div class="score" :aria-label="t.scoreLabel(goals, SHOTS)">
        <span
          v-for="i in SHOTS"
          :key="i"
          class="dot"
          :class="results[i - 1] ?? 'pending'"
          aria-hidden="true"
        ></span>
      </div>
      <p class="best">{{ t.best }}: <strong>{{ best }}/{{ SHOTS }}</strong></p>
    </div>

    <div class="field-wrap">
      <svg
        ref="svg"
        class="field"
        viewBox="0 0 600 360"
        tabindex="0"
        role="application"
        :aria-label="t.fieldLabel"
        :class="{ aiming: phase === 'aim' || phase === 'power' }"
        @pointermove="onPointerMove"
        @pointerdown="onPointerDown"
        @keydown="onKeydown"
      >
        <defs>
          <pattern id="net" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M0 0 L12 12 M12 0 L0 12" stroke="rgba(255,255,255,0.35)" stroke-width="0.8" />
          </pattern>
          <linearGradient id="stands" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#36a2eb" />
            <stop offset="1" stop-color="#9966ff" />
          </linearGradient>
        </defs>

        <rect width="600" height="210" fill="url(#stands)" />
        <g fill="rgba(255,255,255,0.18)">
          <circle v-for="n in 40" :key="n" :cx="(n * 47) % 600" :cy="20 + ((n * 29) % 40)" r="5" />
        </g>
        <rect y="205" width="600" height="155" fill="#3d9a4a" />
        <rect v-for="n in 4" :key="n" :y="205 + (n - 1) * 40" width="600" height="20" fill="#43a851" />
        <path d="M60 340 L120 222 L480 222 L540 340" fill="none" stroke="#fff" stroke-width="3" opacity="0.8" />
        <circle :cx="SPOT.x" :cy="SPOT.y + 8" r="3" fill="#fff" />

        <!-- Portería -->
        <rect :x="GOAL.left" :y="GOAL.top" :width="GOAL.right - GOAL.left" :height="GOAL.bottom - GOAL.top" fill="rgba(0,0,0,0.25)" />
        <rect :x="GOAL.left" :y="GOAL.top" :width="GOAL.right - GOAL.left" :height="GOAL.bottom - GOAL.top" fill="url(#net)" />
        <path
          :d="`M${GOAL.left} ${GOAL.bottom} V${GOAL.top} H${GOAL.right} V${GOAL.bottom}`"
          fill="none"
          stroke="#fff"
          :stroke-width="POST"
          stroke-linejoin="round"
        />

        <!-- Portero -->
        <g :transform="`translate(${keeper.x} ${keeper.y}) rotate(${keeper.r})`">
          <ellipse cx="0" cy="58" rx="22" ry="4" fill="#000" opacity="0.2" v-if="keeper.r === 0" />
          <path d="M-9 20 L-12 56 M9 20 L12 56" stroke="#1b162b" stroke-width="8" stroke-linecap="round" />
          <rect x="-15" y="-18" width="30" height="42" rx="8" fill="#ffce56" />
          <path d="M-14 -12 L-34 -36 M14 -12 L34 -36" stroke="#ffce56" stroke-width="7" stroke-linecap="round" />
          <circle cx="-36" cy="-39" r="6" fill="#fff" />
          <circle cx="36" cy="-39" r="6" fill="#fff" />
          <circle cx="0" cy="-30" r="11" fill="#f1c7a1" />
          <text x="0" y="10" text-anchor="middle" font-size="14" font-weight="700" fill="#1b162b">1</text>
        </g>

        <!-- Mira -->
        <g v-if="phase === 'aim' || phase === 'power'" :transform="`translate(${aim.x} ${aim.y})`" class="crosshair">
          <circle r="13" fill="none" stroke="#ff6384" stroke-width="2.5" />
          <path d="M-20 0 H-7 M7 0 H20 M0 -20 V-7 M0 7 V20" stroke="#ff6384" stroke-width="2.5" />
        </g>

        <!-- Balón -->
        <g :transform="`translate(${ball.x} ${ball.y}) scale(${ball.scale}) rotate(${ball.spin})`">
          <circle r="13" fill="#fff" stroke="#222" stroke-width="1.2" />
          <path d="M0 -5 L5 -1.5 L3 4.5 L-3 4.5 L-5 -1.5 Z" fill="#222" />
          <path d="M0 -13 L0 -5 M5 -1.5 L12 -4 M3 4.5 L7 11 M-3 4.5 L-7 11 M-5 -1.5 L-12 -4" stroke="#222" stroke-width="1.2" />
        </g>
      </svg>

      <div v-if="phase === 'power'" class="meter" aria-hidden="true">
        <span class="needle" :style="{ left: `${meter * 100}%` }"></span>
      </div>

      <Transition name="pop">
        <p v-if="message" class="message" role="status">{{ message }}</p>
      </Transition>

      <div v-if="phase === 'over'" class="overlay">
        <p class="final">{{ t.final(goals, SHOTS) }}</p>
        <button type="button" class="btn-play" @click="restart">{{ t.restart }}</button>
      </div>
    </div>

    <p class="hint">{{ hint || ' ' }}</p>
    <p class="keys">{{ t.keysHint }}</p>
  </div>
</template>

<style scoped>
h3 {
  margin: 0 0 0.35rem;
  font-size: 1.15rem;
}

.description {
  max-width: 65ch;
  margin: 0 0 1.25rem;
  color: var(--text-soft);
}

.board {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.score {
  display: flex;
  gap: 0.45rem;
}

.dot {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.dot.goal {
  border-color: var(--c-teal);
  background: var(--c-teal);
}

.dot.miss {
  border-color: var(--c-pink);
  background: var(--c-pink);
}

.best {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.best strong {
  color: var(--c-yellow);
}

.field-wrap {
  position: relative;
}

.field {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
  touch-action: none;
  user-select: none;
}

.field.aiming {
  cursor: crosshair;
}

.meter {
  position: absolute;
  left: 50%;
  top: 0.9rem;
  width: min(60%, 18rem);
  height: 0.9rem;
  transform: translateX(-50%);
  border: 2px solid #fff;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff6384, #ffce56 35%, #4bc0c0 50%, #ffce56 65%, #ff6384);
}

.needle {
  position: absolute;
  top: -6px;
  bottom: -6px;
  width: 4px;
  margin-left: -2px;
  border-radius: 2px;
  background: #fff;
  box-shadow: 0 0 0 1px #222;
}

.message {
  position: absolute;
  top: 38%;
  left: 50%;
  margin: 0;
  padding: 0.5rem 1.4rem;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: rgba(27, 22, 43, 0.85);
  color: #fff;
  font-size: 1.6rem;
  font-weight: 700;
  pointer-events: none;
}

.pop-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.6);
}

.pop-enter-active {
  transition: opacity 0.2s, transform 0.25s cubic-bezier(0.3, 1.6, 0.6, 1);
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border-radius: 12px;
  background: rgba(27, 22, 43, 0.75);
}

.final {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.btn-play {
  padding: 0.6rem 1.5rem;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--c-pink), var(--c-orange));
  color: #1a1a1a;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.hint {
  margin: 0.9rem 0 0.2rem;
  font-weight: 600;
  color: var(--c-yellow);
}

.keys {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
