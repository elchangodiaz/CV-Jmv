<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { useLocale } from '../../composables/useLocale.js'

const { content } = useLocale()
const t = computed(() => content.value.creative.ttt)

const HUMAN = 'X'
const AI = 'O'
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
]
// Qué tan seguido juega la IA la jugada óptima en cada nivel.
const LEVELS = { easy: 0, normal: 0.65, impossible: 1 }

const board = ref(Array(9).fill(null))
const turn = ref(HUMAN)
const level = ref('impossible')
const showEval = ref(false)
const humanStarts = ref(true)
const score = reactive({ human: 0, draw: 0, ai: 0 })
let timer = 0

function winnerOf(cells) {
  for (const line of LINES) {
    const [a, b, c] = line
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) return { player: cells[a], line }
  }
  return cells.every(Boolean) ? { player: null, line: null } : null
}

// ---------- Minimax ----------
// Valor de la posición para la IA: positivo si gana, negativo si pierde, 0 si empata.
// Se resta la profundidad para preferir ganar pronto y perder tarde.
const memo = new Map()
function minimax(cells, player, depth = 0) {
  const key = cells.map((c) => c ?? '-').join('') + player
  if (memo.has(key)) return memo.get(key) - (memo.get(key) > 0 ? depth : memo.get(key) < 0 ? -depth : 0)
  const result = winnerOf(cells)
  if (result) return result.player === AI ? 10 - depth : result.player === HUMAN ? depth - 10 : 0

  let best = player === AI ? -Infinity : Infinity
  for (let i = 0; i < 9; i++) {
    if (cells[i]) continue
    cells[i] = player
    const value = minimax(cells, player === AI ? HUMAN : AI, depth + 1)
    cells[i] = null
    best = player === AI ? Math.max(best, value) : Math.min(best, value)
  }
  memo.set(key, best > 0 ? best + depth : best < 0 ? best - depth : 0)
  return best
}

const empty = (cells) => cells.map((c, i) => (c ? null : i)).filter((i) => i !== null)

function bestMove(cells) {
  let best = -Infinity
  let moves = []
  for (const i of empty(cells)) {
    const copy = [...cells]
    copy[i] = AI
    const value = minimax(copy, HUMAN, 1)
    if (value > best) {
      best = value
      moves = [i]
    } else if (value === best) moves.push(i)
  }
  return moves[Math.floor(Math.random() * moves.length)]
}

// Evaluación de cada casilla libre desde el punto de vista de quien juega (para mostrarla).
const evaluation = computed(() => {
  if (!showEval.value || result.value || turn.value !== HUMAN) return {}
  const out = {}
  for (const i of empty(board.value)) {
    const copy = [...board.value]
    copy[i] = HUMAN
    const value = minimax(copy, AI, 1)
    out[i] = value < 0 ? 'win' : value > 0 ? 'lose' : 'draw'
  }
  return out
})

const result = computed(() => winnerOf(board.value))

const status = computed(() => {
  if (result.value?.player === HUMAN) return t.value.youWin
  if (result.value?.player === AI) return t.value.aiWins
  if (result.value) return t.value.draw
  return turn.value === HUMAN ? t.value.yourTurn : t.value.aiThinking
})

// ---------- Jugadas ----------
function finishIfOver() {
  const r = result.value
  if (!r) return false
  if (r.player === HUMAN) score.human++
  else if (r.player === AI) score.ai++
  else score.draw++
  return true
}

function play(i) {
  if (turn.value !== HUMAN || board.value[i] || result.value) return
  board.value[i] = HUMAN
  if (finishIfOver()) return
  turn.value = AI
  timer = setTimeout(aiMove, 450)
}

function aiMove() {
  const cells = board.value
  const free = empty(cells)
  const smart = Math.random() < LEVELS[level.value]
  const i = smart ? bestMove(cells) : free[Math.floor(Math.random() * free.length)]
  board.value[i] = AI
  turn.value = HUMAN
  finishIfOver()
}

function newGame() {
  clearTimeout(timer)
  board.value = Array(9).fill(null)
  humanStarts.value = !humanStarts.value
  turn.value = humanStarts.value ? HUMAN : AI
  if (turn.value === AI) timer = setTimeout(aiMove, 450)
}

function setLevel(value) {
  level.value = value
}

function resetScore() {
  Object.assign(score, { human: 0, draw: 0, ai: 0 })
}

// Coordenadas de la línea ganadora sobre la cuadrícula (en %).
const winLine = computed(() => {
  const line = result.value?.line
  if (!line) return null
  const center = (i) => ({ x: (i % 3) * 33.333 + 16.667, y: Math.floor(i / 3) * 33.333 + 16.667 })
  const a = center(line[0])
  const b = center(line[2])
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y }
})

function cellLabel(i) {
  const row = Math.floor(i / 3) + 1
  const col = (i % 3) + 1
  const mark = board.value[i]
  return t.value.cellLabel(row, col, mark)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="ttt">
    <h3>{{ t.title }}</h3>
    <p class="description">{{ t.description }}</p>

    <div class="layout">
      <div class="board-wrap">
        <div class="board" role="group" :aria-label="t.boardLabel">
          <button
            v-for="(cell, i) in board"
            :key="i"
            type="button"
            class="cell"
            :class="[cell && `cell--${cell}`, evaluation[i] && `eval--${evaluation[i]}`]"
            :disabled="Boolean(cell) || Boolean(result) || turn !== 'X'"
            :aria-label="cellLabel(i)"
            @click="play(i)"
          >
            <span v-if="cell" class="mark">{{ cell }}</span>
            <span v-else-if="evaluation[i]" class="hint">{{ t.eval[evaluation[i]] }}</span>
          </button>
          <svg v-if="winLine" class="win-line" viewBox="0 0 100 100" aria-hidden="true">
            <line v-bind="winLine" pathLength="100" />
          </svg>
        </div>
        <p class="status" role="status">{{ status }}</p>
      </div>

      <div class="side">
        <div class="score">
          <div><span class="score-x">{{ score.human }}</span>{{ t.you }} (X)</div>
          <div><span>{{ score.draw }}</span>{{ t.draws }}</div>
          <div><span class="score-o">{{ score.ai }}</span>{{ t.ai }} (O)</div>
        </div>

        <div class="group" role="group" :aria-label="t.levelLabel">
          <p class="group-label">{{ t.levelLabel }}</p>
          <div class="pills">
            <button
              v-for="(_, id) in LEVELS"
              :key="id"
              type="button"
              class="pill"
              :aria-pressed="level === id"
              @click="setLevel(id)"
            >
              {{ t.levels[id] }}
            </button>
          </div>
        </div>

        <label class="toggle-eval">
          <input v-model="showEval" type="checkbox" />
          {{ t.showEval }}
        </label>

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
  flex: 0 1 22rem;
  width: 100%;
  max-width: 22rem;
}

.board {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 8px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--c-purple), var(--c-blue));
}

.cell {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  border: 0;
  border-radius: 10px;
  background: var(--card-head);
  color: #fff;
  font: inherit;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}

.cell:not(:disabled):hover {
  background: #2c2545;
  transform: scale(1.03);
}

.cell:disabled {
  cursor: default;
}

.mark {
  font-size: clamp(2.5rem, 9vw, 4rem);
  font-weight: 700;
  line-height: 1;
  animation: pop 0.25s ease-out;
}

.cell--X .mark {
  color: var(--c-pink);
}

.cell--O .mark {
  color: var(--c-teal);
}

.hint {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.eval--win {
  box-shadow: inset 0 0 0 2px var(--c-teal);
}
.eval--win .hint {
  color: var(--c-teal);
}
.eval--draw {
  box-shadow: inset 0 0 0 2px var(--c-yellow);
}
.eval--draw .hint {
  color: var(--c-yellow);
}
.eval--lose {
  box-shadow: inset 0 0 0 2px var(--c-pink);
}
.eval--lose .hint {
  color: var(--c-pink);
}

@keyframes pop {
  from {
    transform: scale(0.4);
    opacity: 0;
  }
}

.win-line {
  position: absolute;
  inset: 8px;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  pointer-events: none;
}

.win-line line {
  stroke: #fff;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: draw 0.4s ease-out forwards;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
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

.score .score-x {
  color: var(--c-pink);
}

.score .score-o {
  color: var(--c-teal);
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
  border-color: var(--c-yellow);
  background: var(--c-yellow);
  color: #2b2410;
}

.toggle-eval {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
}

.toggle-eval input {
  width: 1.1rem;
  height: 1.1rem;
  accent-color: var(--c-teal);
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
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
