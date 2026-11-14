<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { useLocale } from '../../composables/useLocale.js'

const { content } = useLocale()
const t = computed(() => content.value.creative.c4)

const ROWS = 6
const COLS = 7
const HUMAN = 1
const AI = 2
// Profundidad de búsqueda por nivel (jugadas hacia adelante que analiza la IA).
const LEVELS = { easy: 1, normal: 3, hard: 6 }
const WIN = 1e6

// ---------- Tablero: arreglo de 42 casillas, fila 0 arriba ----------
const idx = (r, c) => r * COLS + c

// Todas las ventanas de 4 casillas en línea (horizontales, verticales y diagonales).
const WINDOWS = []
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
      const cells = [0, 1, 2, 3].map((k) => [r + dr * k, c + dc * k])
      if (cells.every(([rr, cc]) => rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS)) {
        WINDOWS.push(cells.map(([rr, cc]) => idx(rr, cc)))
      }
    }
  }
}

const dropRow = (cells, c) => {
  for (let r = ROWS - 1; r >= 0; r--) if (!cells[idx(r, c)]) return r
  return -1
}

const validCols = (cells) => [3, 2, 4, 1, 5, 0, 6].filter((c) => !cells[c]) // centro primero: mejor poda

function winner(cells) {
  for (const w of WINDOWS) {
    const p = cells[w[0]]
    if (p && p === cells[w[1]] && p === cells[w[2]] && p === cells[w[3]]) return { player: p, cells: w }
  }
  return cells.every(Boolean) ? { player: 0, cells: [] } : null
}

// ---------- Heurística: qué tan prometedora es la posición para la IA ----------
function evaluate(cells) {
  let score = 0
  for (let r = 0; r < ROWS; r++) {
    if (cells[idx(r, 3)] === AI) score += 3
    else if (cells[idx(r, 3)] === HUMAN) score -= 3
  }
  for (const w of WINDOWS) {
    let ai = 0
    let human = 0
    for (const i of w) {
      if (cells[i] === AI) ai++
      else if (cells[i] === HUMAN) human++
    }
    if (ai && human) continue
    if (ai === 3) score += 5
    else if (ai === 2) score += 2
    if (human === 3) score -= 6
    else if (human === 2) score -= 2
  }
  return score
}

// ---------- Minimax con poda alfa-beta ----------
let nodes = 0
function minimax(cells, depth, alpha, beta, maximizing) {
  nodes++
  const result = winner(cells)
  if (result) return result.player === AI ? WIN + depth : result.player === HUMAN ? -WIN - depth : 0
  if (depth === 0) return evaluate(cells)

  const player = maximizing ? AI : HUMAN
  let best = maximizing ? -Infinity : Infinity
  for (const c of validCols(cells)) {
    const r = dropRow(cells, c)
    cells[idx(r, c)] = player
    const value = minimax(cells, depth - 1, alpha, beta, !maximizing)
    cells[idx(r, c)] = 0
    if (maximizing) {
      best = Math.max(best, value)
      alpha = Math.max(alpha, value)
    } else {
      best = Math.min(best, value)
      beta = Math.min(beta, value)
    }
    if (alpha >= beta) break // poda: esta rama ya no puede mejorar el resultado
  }
  return best
}

function chooseColumn(cells, depth) {
  nodes = 0
  let best = -Infinity
  let moves = []
  for (const c of validCols(cells)) {
    const r = dropRow(cells, c)
    cells[idx(r, c)] = AI
    const value = minimax(cells, depth - 1, -Infinity, Infinity, false)
    cells[idx(r, c)] = 0
    if (value > best) {
      best = value
      moves = [c]
    } else if (value === best) moves.push(c)
  }
  return moves[Math.floor(Math.random() * moves.length)]
}

// ---------- Estado del juego ----------
const board = ref(Array(ROWS * COLS).fill(0))
const turn = ref(HUMAN)
const level = ref('normal')
const humanStarts = ref(true)
const hoverCol = ref(null)
const lastMove = ref(null)
const analyzed = ref(0)
const score = reactive({ human: 0, draw: 0, ai: 0 })
let timer = 0

const result = computed(() => winner(board.value))
const winningCells = computed(() => new Set(result.value?.cells ?? []))

const status = computed(() => {
  if (result.value?.player === HUMAN) return t.value.youWin
  if (result.value?.player === AI) return t.value.aiWins
  if (result.value) return t.value.draw
  return turn.value === HUMAN ? t.value.yourTurn : t.value.aiThinking
})

function place(c, player) {
  const r = dropRow(board.value, c)
  if (r < 0) return false
  const next = [...board.value]
  next[idx(r, c)] = player
  board.value = next
  lastMove.value = idx(r, c)
  return true
}

function finishIfOver() {
  const r = result.value
  if (!r) return false
  if (r.player === HUMAN) score.human++
  else if (r.player === AI) score.ai++
  else score.draw++
  return true
}

function play(c) {
  if (turn.value !== HUMAN || result.value || dropRow(board.value, c) < 0) return
  place(c, HUMAN)
  if (finishIfOver()) return
  turn.value = AI
  timer = setTimeout(aiMove, 500)
}

function aiMove() {
  const cells = [...board.value]
  // En fácil, a veces juega al azar para dar oportunidad.
  const free = validCols(cells)
  const c =
    level.value === 'easy' && Math.random() < 0.35
      ? free[Math.floor(Math.random() * free.length)]
      : chooseColumn(cells, LEVELS[level.value])
  analyzed.value = nodes
  place(c, AI)
  turn.value = HUMAN
  finishIfOver()
}

function newGame() {
  clearTimeout(timer)
  board.value = Array(ROWS * COLS).fill(0)
  lastMove.value = null
  analyzed.value = 0
  humanStarts.value = !humanStarts.value
  turn.value = humanStarts.value ? HUMAN : AI
  if (turn.value === AI) timer = setTimeout(aiMove, 500)
}

function resetScore() {
  Object.assign(score, { human: 0, draw: 0, ai: 0 })
}

function onKeydown(event, c) {
  const keys = { ArrowRight: 1, ArrowLeft: -1 }
  if (!(event.key in keys)) return
  event.preventDefault()
  const next = (c + keys[event.key] + COLS) % COLS
  event.currentTarget.parentElement.children[next]?.focus()
}

const canPlay = (c) => turn.value === HUMAN && !result.value && dropRow(board.value, c) >= 0

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="c4">
    <h3>{{ t.title }}</h3>
    <p class="description">{{ t.description }}</p>

    <div class="layout">
      <div class="board-wrap">
        <div class="board" role="group" :aria-label="t.boardLabel" @mouseleave="hoverCol = null">
          <button
            v-for="c in COLS"
            :key="c"
            type="button"
            class="column"
            :class="{ hover: hoverCol === c - 1 && canPlay(c - 1) }"
            :disabled="!canPlay(c - 1)"
            :aria-label="t.columnLabel(c)"
            @mouseenter="hoverCol = c - 1"
            @focus="hoverCol = c - 1"
            @click="play(c - 1)"
            @keydown="onKeydown($event, c - 1)"
          >
            <span
              v-for="r in ROWS"
              :key="r"
              class="slot"
              :class="{ win: winningCells.has(idx(r - 1, c - 1)) }"
            >
              <span
                v-if="board[idx(r - 1, c - 1)]"
                class="disc"
                :class="[
                  `disc--${board[idx(r - 1, c - 1)] === 1 ? 'human' : 'ai'}`,
                  { drop: lastMove === idx(r - 1, c - 1) }
                ]"
                :style="{ '--rows': r }"
              ></span>
            </span>
          </button>
        </div>
        <p class="status" role="status">{{ status }}</p>
      </div>

      <div class="side">
        <div class="score">
          <div><span class="score-human">{{ score.human }}</span>{{ t.you }}</div>
          <div><span>{{ score.draw }}</span>{{ t.draws }}</div>
          <div><span class="score-ai">{{ score.ai }}</span>{{ t.ai }}</div>
        </div>

        <div role="group" :aria-label="t.levelLabel">
          <p class="group-label">{{ t.levelLabel }}</p>
          <div class="pills">
            <button
              v-for="(depth, id) in LEVELS"
              :key="id"
              type="button"
              class="pill"
              :aria-pressed="level === id"
              @click="level = id"
            >
              {{ t.levels[id] }}
            </button>
          </div>
          <p class="note">{{ t.depth(LEVELS[level]) }}</p>
        </div>

        <p v-if="analyzed" class="analyzed">{{ t.analyzed(analyzed) }}</p>

        <div class="actions">
          <button type="button" class="btn-play" @click="newGame">{{ t.newGame }}</button>
          <button type="button" class="link" @click="resetScore">{{ t.resetScore }}</button>
        </div>
        <p class="note">{{ t.note }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin: 0 0 0.35rem;
  font-size: 1.15rem;
}

.description {
  max-width: 65ch;
  margin: 0 0 1.5rem;
  color: var(--text-soft);
}

.layout {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start;
}

.board-wrap {
  flex: 0 1 26rem;
  width: 100%;
  max-width: 26rem;
}

.board {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 8px;
  border-radius: 14px;
  background: linear-gradient(160deg, var(--c-blue), var(--c-purple));
}

.column {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  gap: 4px;
  padding: 2px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: background 0.2s;
}

.column:disabled {
  cursor: default;
}

.column.hover,
.column:focus-visible {
  background: rgba(255, 255, 255, 0.16);
}

.slot {
  position: relative;
  display: block;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--card-head);
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.45);
}

.disc {
  position: absolute;
  inset: 6%;
  border-radius: 50%;
}

.disc--human {
  background: radial-gradient(circle at 35% 30%, #ff9fb3, var(--c-pink) 60%);
}

.disc--ai {
  background: radial-gradient(circle at 35% 30%, #ffe3a1, var(--c-yellow) 60%);
}

/* La ficha cae desde arriba del tablero hasta su lugar */
.disc.drop {
  animation: drop calc(0.12s + var(--rows) * 0.05s) cubic-bezier(0.5, 0, 0.75, 0);
}

@keyframes drop {
  from {
    transform: translateY(calc(var(--rows) * -118%));
  }
}

.slot.win .disc {
  box-shadow: 0 0 0 3px #fff, 0 0 14px #fff;
  animation: glow 0.9s ease-in-out infinite alternate;
}

@keyframes glow {
  to {
    transform: scale(0.88);
  }
}

.status {
  margin: 1rem 0 0;
  text-align: center;
  font-weight: 700;
  color: var(--c-yellow);
}

.side {
  flex: 1 1 16rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.score {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.score > div {
  padding: 0.75rem 0.5rem;
  border-radius: 10px;
  background: var(--card-head);
}

.score span {
  display: block;
  font-size: 1.6rem;
  font-weight: 700;
  color: #fff;
}

.score .score-human {
  color: var(--c-pink);
}

.score .score-ai {
  color: var(--c-yellow);
}

.group-label {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.pills {
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
}

.pill[aria-pressed='true'] {
  border-color: var(--c-orange);
  background: var(--c-orange);
  color: #2b1a08;
}

.analyzed {
  margin: 0;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  background: var(--card-head);
  font-size: 0.85rem;
  color: var(--text-soft);
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
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

.link {
  padding: 0;
  border: 0;
  background: none;
  color: var(--text-soft);
  font: inherit;
  font-size: 0.85rem;
  text-decoration: underline;
  cursor: pointer;
}

.note {
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
