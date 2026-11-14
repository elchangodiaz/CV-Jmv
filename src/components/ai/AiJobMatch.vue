<script setup>
import { computed, ref } from 'vue'
import { useLocale } from '../../composables/useLocale.js'
import { useCvState } from '../../composables/useCvState.js'
import { AiError, aiEnabled, matchJob } from '../../composables/useAi.js'
import { localMatch } from '../../ai/localMatch.js'
import { allSkills } from '../../ai/cvText.js'

const MAX_JOB = 8000
const MIN_JOB = 40

const { content, locale } = useLocale()
const { selectedSkill, selectSkill, focusSection, isLinkedSkill } = useCvState()
const t = computed(() => content.value.ai.match)

const job = ref('')
const loading = ref(false)
const error = ref('')
const result = ref(null) // { source: 'ai' | 'local', ... }

const canAnalyze = computed(() => !loading.value && job.value.trim().length >= MIN_JOB)
const statusIcon = { yes: '✓', partial: '◐', no: '✕' }

async function analyze() {
  if (!canAnalyze.value) return
  error.value = ''
  result.value = null
  const text = job.value.trim()

  if (!aiEnabled) {
    result.value = { source: 'local', ...localMatch(text, allSkills(content.value)) }
    return
  }

  loading.value = true
  try {
    result.value = { source: 'ai', ...(await matchJob(locale.value, text)) }
  } catch (e) {
    const code = e instanceof AiError ? e.code : 'default'
    error.value = `${content.value.ai.errors[code] ?? content.value.ai.errors.default} ${content.value.ai.fallbackNote}`
    result.value = { source: 'local', ...localMatch(text, allSkills(content.value)) }
  } finally {
    loading.value = false
  }
}

function useSample() {
  job.value = t.value.sampleText
  result.value = null
  error.value = ''
}

// Lleva la habilidad a la tabla de Habilidades, que muestra dónde se usó.
function showSkill(skill) {
  if (selectedSkill.value !== skill) selectSkill(skill)
  focusSection('skills')
}
</script>

<template>
  <div class="match">
    <form @submit.prevent="analyze">
      <label class="label" for="ai-job">{{ t.label }}</label>
      <textarea
        id="ai-job"
        v-model="job"
        rows="6"
        :maxlength="MAX_JOB"
        :placeholder="t.placeholder"
      ></textarea>
      <div class="actions">
        <button type="button" class="link" @click="useSample">{{ t.sample }}</button>
        <span class="counter">{{ t.count(job.length, MAX_JOB) }}</span>
        <button type="submit" class="btn btn-primary" :disabled="!canAnalyze">
          {{ loading ? t.analyzing : t.analyze }}
        </button>
      </div>
    </form>

    <p v-if="error" class="alert" role="alert">{{ error }}</p>

    <div v-if="loading" class="skeleton" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>

    <div v-if="result" class="result" role="status">
      <!-- Resultado de la IA -->
      <template v-if="result.source === 'ai'">
        <div class="verdict">
          <span class="fit" :class="`fit--${result.fit}`">{{ t.fit[result.fit] }}</span>
          <p class="summary">{{ result.summary }}</p>
        </div>

        <h3 v-if="result.requirements.length" class="subtitle">{{ t.requirements }}</h3>
        <ul class="requirements">
          <li v-for="(r, i) in result.requirements" :key="i" :class="`req--${r.status}`">
            <span class="icon" aria-hidden="true">{{ statusIcon[r.status] }}</span>
            <div>
              <p class="req-title">
                {{ r.requirement }}
                <span class="req-status">{{ t.status[r.status] }}</span>
              </p>
              <p v-if="r.evidence" class="evidence">{{ r.evidence }}</p>
            </div>
          </li>
        </ul>
      </template>

      <!-- Resultado por palabras clave -->
      <template v-else>
        <h3 class="subtitle">{{ t.localTitle }}</h3>
        <p class="note">{{ t.localNote }}</p>
        <p v-if="!result.skills.length" class="note">{{ t.localNone }}</p>
      </template>

      <template v-if="result.skills.length">
        <h3 v-if="result.source === 'ai'" class="subtitle">{{ t.skills }}</h3>
        <p class="note">{{ t.skillsHint }}</p>
        <ul class="chips">
          <li v-for="skill in result.skills" :key="skill">
            <button v-if="isLinkedSkill(skill)" type="button" class="chip chip-button linked" @click="showSkill(skill)">
              {{ skill }}
            </button>
            <span v-else class="chip">{{ skill }}</span>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<style scoped>
.label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
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
  line-height: 1.6;
  resize: vertical;
}

textarea:focus {
  border-color: #fff;
  outline: none;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.75rem;
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

.counter {
  font-size: 0.78rem;
  color: var(--text-muted);
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

.alert {
  margin: 1rem 0 0;
  padding: 0.7rem 1rem;
  border-left: 3px solid var(--c-orange);
  border-radius: 6px;
  background: rgba(255, 159, 64, 0.12);
  font-size: 0.9rem;
}

.skeleton {
  display: grid;
  gap: 0.6rem;
  margin-top: 1.5rem;
}

.skeleton span {
  height: 0.9rem;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--chip-bg), #555, var(--chip-bg));
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
}

.skeleton span:nth-child(2) {
  width: 80%;
}

.skeleton span:nth-child(3) {
  width: 60%;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

.result {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 10px;
  background: var(--card-head);
}

.verdict {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 1rem;
}

.fit {
  flex-shrink: 0;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
}

.fit--high {
  background: var(--c-teal);
  color: #10282a;
}

.fit--medium {
  background: var(--c-yellow);
  color: #2b2410;
}

.fit--low {
  background: var(--c-pink);
  color: #2b1018;
}

.summary {
  flex: 1 1 20rem;
  margin: 0;
  line-height: 1.7;
}

.subtitle {
  margin: 1.5rem 0 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
}

.result > .subtitle:first-child {
  margin-top: 0;
}

.requirements {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.requirements li {
  display: flex;
  gap: 0.75rem;
}

.icon {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: 700;
}

.req--yes .icon {
  background: var(--c-teal);
  color: #10282a;
}

.req--partial .icon {
  background: var(--c-yellow);
  color: #2b2410;
}

.req--no .icon {
  background: #555;
  color: #fff;
}

.req-title {
  margin: 0;
  font-weight: 500;
}

.req-status {
  margin-left: 0.4rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.evidence {
  margin: 0.2rem 0 0;
  font-size: 0.88rem;
  color: var(--text-soft);
}

.note {
  margin: 0 0 0.75rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}
</style>
