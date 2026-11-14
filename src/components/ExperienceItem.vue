<script setup>
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale.js'
import { useCvState } from '../composables/useCvState.js'
import { formatDuration, formatPeriod } from '../utils/dates.js'
import organizations from '../content/organizations.js'
import OrgLogo from './OrgLogo.vue'

const props = defineProps({
  job: { type: Object, required: true }
})

const { content } = useLocale()
const { expanded, flashedJob, selectedSkill, selectSkill, jobMatches, toggleJob } = useCvState()

const org = computed(() => organizations[props.job.org])
const isOpen = computed(() => expanded.has(props.job.id))
const matches = computed(() => jobMatches(props.job))
const bodyId = computed(() => `job-body-${props.job.id}`)

const related = computed(() => {
  const list = []
  if (props.job.client) list.push({ label: content.value.ui.client, org: props.job.client })
  if (props.job.project) list.push({ label: content.value.ui.project, org: props.job.project })
  return list
})
</script>

<template>
  <article
    :id="`job-${job.id}`"
    class="job"
    :class="{
      open: isOpen,
      dimmed: !matches,
      highlighted: selectedSkill && matches,
      flash: flashedJob === job.id
    }"
  >
    <button
      type="button"
      class="job-head"
      :aria-expanded="isOpen"
      :aria-controls="bodyId"
      @click="toggleJob(job.id)"
    >
      <OrgLogo :org="job.org" size="md" />
      <span class="job-main">
        <span class="job-role">{{ job.role }}</span>
        <span class="job-org">{{ org.name }} · {{ job.location }}</span>
      </span>
      <span class="job-period">
        <span>{{ formatPeriod(job.period, content.ui) }}</span>
        <span class="job-duration">{{ formatDuration(job.period, content.ui) }}</span>
      </span>
      <span class="chevron" aria-hidden="true"></span>
    </button>

    <div v-if="related.length" class="related">
      <span v-for="item in related" :key="item.org" class="related-item">
        <span class="related-label">{{ item.label }}:</span>
        <OrgLogo :org="item.org" size="sm" />
        <span>{{ organizations[item.org].name }}</span>
      </span>
    </div>

    <p v-if="job.note" class="note">{{ job.note }}</p>

    <div :id="bodyId" class="job-body" :inert="!isOpen">
      <div class="job-body-inner">
        <ul class="bullets">
          <li v-for="(bullet, i) in job.bullets" :key="i">{{ bullet }}</li>
        </ul>
        <ul class="chips">
          <li v-for="tech in job.tech" :key="tech">
            <button
              type="button"
              class="chip chip-button"
              :class="{ selected: selectedSkill === tech }"
              :aria-pressed="selectedSkill === tech"
              @click="selectSkill(tech)"
            >
              {{ tech }}
            </button>
          </li>
        </ul>
      </div>
    </div>

    <button type="button" class="toggle" :aria-controls="bodyId" @click="toggleJob(job.id)">
      {{ isOpen ? content.ui.hideDetails : content.ui.showDetails }}
    </button>
  </article>
</template>

<style scoped>
.job {
  padding: 1.25rem 1.5rem;
  border-radius: 10px;
  background: var(--card-head);
  border: 1px solid transparent;
  transition: opacity 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s;
}

.job + .job {
  margin-top: 1rem;
}

.job.dimmed {
  opacity: 0.35;
}

.job.highlighted {
  border-color: rgba(255, 255, 255, 0.55);
}

.job.flash {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.6);
  transform: scale(1.01);
}

.job-head {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.job-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.job-role {
  font-size: 1.1rem;
  font-weight: 600;
}

.job-org {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.job-period {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.85rem;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.job-duration {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.chevron {
  width: 0.6rem;
  height: 0.6rem;
  border-right: 2px solid var(--text-muted);
  border-bottom: 2px solid var(--text-muted);
  transform: rotate(45deg);
  transition: transform 0.3s;
}

.open .chevron {
  transform: rotate(-135deg);
}

.related {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  margin: 0.9rem 0 0 4.25rem;
  font-size: 0.85rem;
}

.related-item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.related-label {
  color: var(--text-muted);
}

.note {
  margin: 0.6rem 0 0 4.25rem;
  font-size: 0.82rem;
  font-style: italic;
  color: var(--text-muted);
}

/* Despliegue animado de alto variable */
.job-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s ease;
}

.open .job-body {
  grid-template-rows: 1fr;
}

.job-body-inner {
  overflow: hidden;
  padding-left: 4.25rem;
}

.bullets {
  margin: 1.1rem 0 1rem;
  padding-left: 1.1rem;
}

.bullets li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  color: var(--text-soft);
}

.chips {
  padding-bottom: 0.25rem;
}

.toggle {
  display: block;
  margin: 0.75rem 0 0 auto;
  padding: 0;
  border: 0;
  background: none;
  color: var(--text-muted);
  font: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.toggle:hover {
  color: #fff;
}

@media (max-width: 640px) {
  .job {
    padding: 1rem;
  }
  .job-head {
    grid-template-columns: auto 1fr auto;
  }
  .job-period {
    grid-column: 2 / 4;
    grid-row: 2;
    align-items: flex-start;
  }
  .related,
  .note,
  .job-body-inner {
    margin-left: 0;
    padding-left: 0;
  }
}
</style>
