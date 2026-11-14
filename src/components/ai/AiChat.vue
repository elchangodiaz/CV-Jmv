<script setup>
import { computed, nextTick, ref } from 'vue'
import { useLocale } from '../../composables/useLocale.js'
import { AiError, aiEnabled, askCv } from '../../composables/useAi.js'

const MAX_QUESTION = 600
const HISTORY = 8

const { content, locale } = useLocale()
const t = computed(() => content.value.ai.chat)

const messages = ref([])
const draft = ref('')
const loading = ref(false)
const error = ref('')
const listRef = ref(null)
const inputRef = ref(null)

const canSend = computed(() => aiEnabled && !loading.value && draft.value.trim().length > 0)

const errorText = (code) => content.value.ai.errors[code] ?? content.value.ai.errors.default

async function scrollToEnd() {
  await nextTick()
  const list = listRef.value
  if (list) list.scrollTop = list.scrollHeight
}

async function send(text = draft.value) {
  const question = text.trim().slice(0, MAX_QUESTION)
  if (!question || loading.value || !aiEnabled) return
  error.value = ''
  draft.value = ''
  messages.value.push({ role: 'user', content: question })
  loading.value = true
  scrollToEnd()
  try {
    const history = messages.value.slice(-HISTORY).map(({ role, content }) => ({ role, content }))
    const { answer } = await askCv(locale.value, history)
    messages.value.push({ role: 'assistant', content: answer })
  } catch (e) {
    // La pregunta fallida se devuelve al cuadro de texto para poder reintentarla.
    messages.value.pop()
    draft.value = question
    error.value = errorText(e instanceof AiError ? e.code : 'default')
  } finally {
    loading.value = false
    scrollToEnd()
    inputRef.value?.focus()
  }
}

function onKeydown(event) {
  // Enter envía; Shift + Enter agrega un salto de línea.
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault()
    send()
  }
}

function clear() {
  messages.value = []
  error.value = ''
  inputRef.value?.focus()
}
</script>

<template>
  <div class="chat">
    <p v-if="!aiEnabled" class="alert" role="status">{{ content.ai.errors.disabled }}</p>

    <div ref="listRef" class="messages" aria-live="polite">
      <div v-if="!messages.length" class="empty">
        <p class="suggestions-title">{{ t.suggestionsTitle }}</p>
        <ul class="suggestions">
          <li v-for="s in t.suggestions" :key="s">
            <button type="button" class="chip chip-button" :disabled="!aiEnabled || loading" @click="send(s)">
              {{ s }}
            </button>
          </li>
        </ul>
      </div>

      <div v-for="(m, i) in messages" :key="i" class="message" :class="`message--${m.role}`">
        <span class="author">{{ m.role === 'user' ? t.you : t.assistant }}</span>
        <p class="bubble">{{ m.content }}</p>
      </div>

      <div v-if="loading" class="message message--assistant">
        <span class="author">{{ t.assistant }}</span>
        <p class="bubble typing"><span></span><span></span><span></span><span class="visually-hidden">{{ t.thinking }}</span></p>
      </div>
    </div>

    <p v-if="error" class="alert" role="alert">{{ error }}</p>

    <form class="composer" @submit.prevent="send()">
      <label class="visually-hidden" for="ai-question">{{ t.placeholder }}</label>
      <textarea
        id="ai-question"
        ref="inputRef"
        v-model="draft"
        rows="2"
        :maxlength="MAX_QUESTION"
        :placeholder="t.placeholder"
        :disabled="!aiEnabled"
        @keydown="onKeydown"
      ></textarea>
      <div class="actions">
        <button v-if="messages.length" type="button" class="link" @click="clear">{{ t.clear }}</button>
        <span class="counter">{{ draft.length }} / {{ MAX_QUESTION }}</span>
        <button type="submit" class="btn btn-primary" :disabled="!canSend">{{ t.send }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.messages {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 26rem;
  min-height: 9rem;
  padding: 1.25rem;
  border-radius: 10px;
  background: var(--card-head);
  overflow-y: auto;
}

.suggestions-title {
  margin: 0 0 0.75rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.suggestions .chip {
  text-align: left;
}

.chip-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 85%;
}

.message--user {
  align-self: flex-end;
  align-items: flex-end;
}

.author {
  margin-bottom: 0.25rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.bubble {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  line-height: 1.6;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.message--assistant .bubble {
  border-top-left-radius: 2px;
  background: var(--chip-bg);
  color: var(--text-soft);
}

.message--user .bubble {
  border-top-right-radius: 2px;
  background: #fff;
  color: var(--card-head);
}

[data-mode='creative'] .message--user .bubble {
  background: linear-gradient(120deg, var(--c-purple), var(--c-blue));
  color: #fff;
}

.typing {
  display: flex;
  gap: 0.3rem;
  padding: 1rem;
}

.typing span:not(.visually-hidden) {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: var(--text-muted);
  animation: dot 1s infinite ease-in-out;
}

.typing span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes dot {
  50% {
    opacity: 0.3;
    transform: translateY(-3px);
  }
}

.alert {
  margin: 1rem 0 0;
  padding: 0.7rem 1rem;
  border-left: 3px solid var(--c-orange);
  border-radius: 6px;
  background: rgba(255, 159, 64, 0.12);
  font-size: 0.9rem;
}

.chat > .alert:first-child {
  margin: 0 0 1rem;
}

.composer {
  margin-top: 1rem;
}

textarea {
  display: block;
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #5a5a5a;
  border-radius: 8px;
  background: var(--card-head);
  color: var(--text);
  font: inherit;
  resize: vertical;
}

textarea:focus {
  border-color: #fff;
  outline: none;
}

textarea:disabled {
  opacity: 0.5;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.75rem;
}

.counter {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.link {
  margin-right: auto;
  padding: 0;
  border: 0;
  background: none;
  color: var(--text-soft);
  font: inherit;
  font-size: 0.85rem;
  text-decoration: underline;
  cursor: pointer;
}

.btn {
  border: 0;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
