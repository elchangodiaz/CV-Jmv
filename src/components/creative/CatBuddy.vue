<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLocale } from '../../composables/useLocale.js'

const { content } = useLocale()
const t = computed(() => content.value.creative.cat)

const EYES = [
  { x: 174, y: 128 },
  { x: 226, y: 128 }
]
const IDLE_MS = 15000 // sin interacción, se duerme
const PET_STEP = 260 // distancia de "caricia" que suelta un corazón

const svg = ref(null)
const look = ref({ x: 0, y: 0 })
const mood = ref('awake') // awake | happy | eating | asleep
const blinking = ref(false)
const bubble = ref('')
const earTwitch = ref(false)
const showTreat = ref(false)
const hearts = ref([])
const love = ref(0)

let petDistance = 0
let lastPet = null
let heartSeq = 0
const timers = { idle: 0, blink: 0, mood: 0, bubble: 0, ear: 0, treat: 0 }

// ---------- Mirada ----------
function toSvg(event) {
  const pt = svg.value.createSVGPoint()
  pt.x = event.clientX
  pt.y = event.clientY
  return pt.matrixTransform(svg.value.getScreenCTM().inverse())
}

function onMove(event) {
  if (!svg.value) return
  const p = toSvg(event)
  const dx = p.x - 200
  const dy = p.y - 128
  const dist = Math.hypot(dx, dy) || 1
  const k = Math.min(1, dist / 160)
  look.value = { x: (dx / dist) * 6 * k, y: (dy / dist) * 4 * k }
}

// ---------- Caricias: pasar el puntero sobre el gato ----------
function onPet(event) {
  if (mood.value === 'asleep' || mood.value === 'eating') return
  const p = { x: event.clientX, y: event.clientY }
  if (lastPet) petDistance += Math.hypot(p.x - lastPet.x, p.y - lastPet.y)
  lastPet = p
  if (petDistance > PET_STEP) {
    petDistance = 0
    happy()
  }
}

function happy() {
  wake()
  setMood('happy', 1300)
  addHeart()
  say(t.value.purr, 1300)
}

function addHeart() {
  love.value++
  const id = ++heartSeq
  hearts.value.push({ id, left: 35 + Math.random() * 30, drift: (Math.random() - 0.5) * 60 })
  setTimeout(() => (hearts.value = hearts.value.filter((h) => h.id !== id)), 1600)
}

// ---------- Acciones ----------
function setMood(value, ms) {
  clearTimeout(timers.mood)
  mood.value = value
  if (ms) timers.mood = setTimeout(() => (mood.value = 'awake'), ms)
}

function say(text, ms = 1500) {
  clearTimeout(timers.bubble)
  bubble.value = text
  timers.bubble = setTimeout(() => (bubble.value = ''), ms)
}

function meow() {
  if (mood.value === 'asleep') {
    wake()
    say(t.value.grumpy)
    return
  }
  const list = t.value.meows
  say(list[Math.floor(Math.random() * list.length)])
  earTwitch.value = true
  clearTimeout(timers.ear)
  timers.ear = setTimeout(() => (earTwitch.value = false), 400)
  resetIdle()
}

function treat() {
  wake()
  showTreat.value = true
  setMood('eating', 1600)
  say(t.value.eating, 1600)
  clearTimeout(timers.treat)
  timers.treat = setTimeout(() => {
    showTreat.value = false
    addHeart()
    addHeart()
  }, 1500)
}

function toggleSleep() {
  if (mood.value === 'asleep') {
    wake()
    say(t.value.yawn)
  } else {
    sleep()
  }
}

function sleep() {
  clearTimeout(timers.mood)
  mood.value = 'asleep'
  bubble.value = ''
}

function wake() {
  if (mood.value === 'asleep') mood.value = 'awake'
  resetIdle()
}

function resetIdle() {
  clearTimeout(timers.idle)
  timers.idle = setTimeout(sleep, IDLE_MS)
}

function scheduleBlink() {
  timers.blink = setTimeout(() => {
    blinking.value = true
    setTimeout(() => {
      blinking.value = false
      scheduleBlink()
    }, 140)
  }, 2500 + Math.random() * 3000)
}

const eyesClosed = computed(() => mood.value !== 'awake' || blinking.value)

onMounted(() => {
  resetIdle()
  scheduleBlink()
})

onBeforeUnmount(() => Object.values(timers).forEach(clearTimeout))
</script>

<template>
  <div class="cat-lab">
    <div class="head">
      <div>
        <h3>{{ t.title }}</h3>
        <p class="description">{{ t.description }}</p>
      </div>
      <p class="counter" aria-live="polite">♥ {{ t.love(love) }}</p>
    </div>

    <div class="stage" :class="`mood-${mood}`" @pointermove="onMove">
      <svg ref="svg" viewBox="0 0 400 310" role="img" :aria-label="t.sceneLabel[mood]">
        <defs>
          <radialGradient id="cat-floor" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stop-color="#000" stop-opacity="0.3" />
            <stop offset="1" stop-color="#000" stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- Cojín -->
        <ellipse cx="200" cy="290" rx="130" ry="18" fill="url(#cat-floor)" />
        <ellipse cx="200" cy="282" rx="115" ry="16" fill="#9966ff" />
        <ellipse cx="200" cy="278" rx="105" ry="11" fill="#b08cff" />

        <g class="cat" @pointermove="onPet" @pointerleave="lastPet = null" @click="meow">
          <!-- Cola -->
          <g class="tail">
            <path d="M255 262 C320 262 330 210 305 175" fill="none" stroke="#e8964e" stroke-width="16" stroke-linecap="round" />
            <path d="M318 205 l12 4 M312 186 l12 -1" stroke="#c4732f" stroke-width="5" stroke-linecap="round" />
          </g>

          <!-- Cuerpo -->
          <g class="body">
            <ellipse cx="200" cy="225" rx="68" ry="55" fill="#f2a65a" />
            <ellipse cx="200" cy="235" rx="36" ry="38" fill="#fbe3c8" />
            <path d="M140 205 q10 6 18 0 M138 228 q10 6 18 0 M242 205 q10 6 18 0 M244 228 q10 6 18 0" stroke="#c4732f" stroke-width="5" fill="none" stroke-linecap="round" />
            <ellipse cx="174" cy="276" rx="18" ry="10" fill="#f2a65a" />
            <ellipse cx="226" cy="276" rx="18" ry="10" fill="#f2a65a" />
            <path d="M168 280 v-5 M174 281 v-5 M180 280 v-5 M220 280 v-5 M226 281 v-5 M232 280 v-5" stroke="#c4732f" stroke-width="1.5" stroke-linecap="round" />
          </g>

          <!-- Cabeza -->
          <g class="head-group">
            <g class="ears" :class="{ twitch: earTwitch }">
              <path d="M140 105 L136 46 L186 80 Z" fill="#f2a65a" />
              <path d="M146 96 L144 60 L174 81 Z" fill="#ff9fb3" />
              <path d="M260 105 L264 46 L214 80 Z" fill="#f2a65a" />
              <path d="M254 96 L256 60 L226 81 Z" fill="#ff9fb3" />
            </g>
            <ellipse cx="200" cy="130" rx="70" ry="58" fill="#f2a65a" />
            <path d="M186 76 l4 18 M200 74 v20 M214 76 l-4 18" stroke="#c4732f" stroke-width="5" stroke-linecap="round" />
            <ellipse cx="200" cy="160" rx="30" ry="20" fill="#fbe3c8" />

            <!-- Ojos -->
            <template v-if="!eyesClosed">
              <g v-for="(eye, i) in EYES" :key="i">
                <ellipse :cx="eye.x" :cy="eye.y" rx="14" ry="15" fill="#c9e265" />
                <ellipse :cx="eye.x + look.x" :cy="eye.y + look.y" rx="4.5" ry="11" fill="#141414" />
                <circle :cx="eye.x + look.x + 3" :cy="eye.y + look.y - 5" r="2.5" fill="#fff" />
              </g>
            </template>
            <template v-else-if="mood === 'happy' || mood === 'eating'">
              <path v-for="(eye, i) in EYES" :key="i" :d="`M${eye.x - 13} ${eye.y + 4} q13 -16 26 0`" stroke="#141414" stroke-width="4" fill="none" stroke-linecap="round" />
            </template>
            <template v-else>
              <path v-for="(eye, i) in EYES" :key="i" :d="`M${eye.x - 13} ${eye.y} q13 9 26 0`" stroke="#141414" stroke-width="4" fill="none" stroke-linecap="round" />
            </template>

            <!-- Rubor al estar contento -->
            <g v-if="mood === 'happy'" fill="#ff6384" opacity="0.45">
              <ellipse cx="152" cy="152" rx="11" ry="6" />
              <ellipse cx="248" cy="152" rx="11" ry="6" />
            </g>

            <path d="M193 150 h14 l-7 8 Z" fill="#ff6384" />
            <path
              v-if="mood === 'eating'"
              class="chew"
              d="M190 162 q10 12 20 0 Z"
              fill="#8a2f45"
            />
            <path v-else d="M200 158 q-7 9 -15 3 M200 158 q7 9 15 3" stroke="#141414" stroke-width="2.5" fill="none" stroke-linecap="round" />

            <g stroke="#6b4a2c" stroke-width="1.5" stroke-linecap="round" opacity="0.8">
              <path d="M168 156 L116 148 M168 162 L118 166 M232 156 L284 148 M232 162 L282 166" />
            </g>
          </g>
        </g>

        <!-- Premio -->
        <g v-if="showTreat" class="treat">
          <path d="M175 196 q25 -16 50 0 q-25 16 -50 0 Z" fill="#36a2eb" />
          <path d="M225 196 l14 -10 v20 Z" fill="#36a2eb" />
          <circle cx="186" cy="194" r="2.5" fill="#fff" />
        </g>
      </svg>

      <span v-for="h in hearts" :key="h.id" class="heart" :style="{ left: `${h.left}%`, '--drift': `${h.drift}px` }" aria-hidden="true">♥</span>
      <span v-if="mood === 'asleep'" class="zzz" aria-hidden="true">z<span>z</span><span>z</span></span>
      <Transition name="bubble">
        <p v-if="bubble" class="bubble" role="status">{{ bubble }}</p>
      </Transition>
    </div>

    <div class="controls">
      <button type="button" class="pill" @click="happy">🤚 {{ t.pet }}</button>
      <button type="button" class="pill" @click="treat">🐟 {{ t.treat }}</button>
      <button type="button" class="pill" @click="meow">💬 {{ t.talk }}</button>
      <button type="button" class="pill" @click="toggleSleep">
        {{ mood === 'asleep' ? '☀️ ' + t.wake : '🌙 ' + t.sleep }}
      </button>
    </div>
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
  color: var(--c-pink);
  font-weight: 700;
  white-space: nowrap;
}

.stage {
  position: relative;
  max-width: 34rem;
  margin: 0 auto;
  border-radius: 16px;
  background: radial-gradient(circle at 50% 35%, rgba(255, 206, 86, 0.25), transparent 60%),
    linear-gradient(180deg, #2f2650, #1b162b);
  overflow: hidden;
  transition: filter 0.6s;
}

.stage.mood-asleep {
  filter: brightness(0.7) saturate(0.8);
}

svg {
  display: block;
  width: 100%;
  height: auto;
  touch-action: pan-y;
}

.cat {
  cursor: grab;
}

.tail {
  transform-box: view-box;
  transform-origin: 255px 262px;
  animation: sway 2.4s ease-in-out infinite;
}

.mood-happy .tail {
  animation-duration: 0.7s;
}

.mood-asleep .tail {
  animation: none;
}

.body,
.head-group {
  transform-box: view-box;
  transform-origin: 200px 280px;
}

.mood-asleep .body,
.mood-asleep .head-group {
  animation: breathe 3s ease-in-out infinite;
}

.mood-asleep .head-group {
  transform: translateY(8px) rotate(-6deg);
  animation: none;
}

.ears {
  transform-box: view-box;
  transform-origin: 200px 100px;
}

.ears.twitch {
  animation: twitch 0.4s ease-in-out;
}

.chew {
  transform-box: fill-box;
  transform-origin: center top;
  animation: chew 0.25s ease-in-out infinite alternate;
}

.treat {
  transform-box: view-box;
  transform-origin: 200px 170px;
  animation: eat 1.5s ease-in forwards;
}

@keyframes sway {
  0%,
  100% {
    transform: rotate(-6deg);
  }
  50% {
    transform: rotate(10deg);
  }
}

@keyframes breathe {
  50% {
    transform: scale(1.025, 0.985);
  }
}

@keyframes twitch {
  30% {
    transform: rotate(-4deg);
  }
  70% {
    transform: rotate(4deg);
  }
}

@keyframes chew {
  to {
    transform: scaleY(0.4);
  }
}

@keyframes eat {
  0% {
    transform: translate(140px, 60px) scale(0.8);
  }
  35% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(0, -18px) scale(0);
  }
}

.heart {
  position: absolute;
  top: 30%;
  color: var(--c-pink);
  font-size: 1.6rem;
  pointer-events: none;
  animation: float 1.6s ease-out forwards;
}

@keyframes float {
  from {
    opacity: 1;
    transform: translate(0, 0) scale(0.6);
  }
  to {
    opacity: 0;
    transform: translate(var(--drift), -110px) scale(1.2);
  }
}

.zzz {
  position: absolute;
  top: 12%;
  right: 24%;
  color: #fff;
  font-size: 1.4rem;
  font-weight: 700;
  animation: zzz 2.4s ease-in-out infinite;
}

.zzz span:nth-child(1) {
  font-size: 1.1em;
  margin-left: 0.1em;
}

.zzz span:nth-child(2) {
  font-size: 1.25em;
}

@keyframes zzz {
  50% {
    opacity: 0.5;
    transform: translateY(-8px);
  }
}

.bubble {
  position: absolute;
  top: 6%;
  left: 8%;
  margin: 0;
  padding: 0.45rem 1rem;
  border-radius: 14px 14px 14px 2px;
  background: #fff;
  color: #1b162b;
  font-weight: 700;
  pointer-events: none;
}

.bubble-enter-from,
.bubble-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.9);
}

.bubble-enter-active,
.bubble-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
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
  transition: border-color 0.2s, transform 0.2s;
}

.pill:hover {
  border-color: var(--c-yellow);
  transform: translateY(-1px);
}
</style>
