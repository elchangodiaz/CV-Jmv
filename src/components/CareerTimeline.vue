<script setup>
import { computed, ref } from 'vue'
import { useLocale } from '../composables/useLocale.js'
import { useCvState } from '../composables/useCvState.js'
import { formatDuration, formatPeriod, toMonthIndex } from '../utils/dates.js'
import organizations from '../content/organizations.js'
import OrgLogo from './OrgLogo.vue'

const { content } = useLocale()
const { focusJob, focusSection } = useCvState()

const hovered = ref(null)

const range = computed(() => {
  const starts = [content.value.education.period[0], ...content.value.experience.map((j) => j.period[0])]
  const first = Math.min(...starts.map(toMonthIndex))
  const startYear = Math.floor(first / 12)
  const endIndex = toMonthIndex(null) + 1
  const endYear = Math.floor(endIndex / 12) + 1
  return { start: startYear * 12, end: endYear * 12, startYear, endYear }
})

const years = computed(() => {
  const list = []
  for (let y = range.value.startYear; y < range.value.endYear; y++) list.push(y)
  return list
})

function position(period) {
  const { start, end } = range.value
  const total = end - start
  const from = toMonthIndex(period[0]) - start
  const to = toMonthIndex(period[1]) - start
  return { left: `${(from / total) * 100}%`, width: `${(Math.max(1, to - from) / total) * 100}%` }
}

const lanes = computed(() => {
  const { ui, education, experience } = content.value
  return [
    {
      key: 'education',
      label: ui.timeline.education,
      items: [
        {
          id: 'education',
          org: education.orgs[0],
          title: education.degree,
          subtitle: `${education.school} · ${education.campus}`,
          period: education.period,
          periodLabel: education.years,
          action: () => focusSection('education')
        }
      ]
    },
    {
      key: 'work',
      label: ui.timeline.work,
      items: experience.map((job) => ({
        id: job.id,
        org: job.org,
        title: job.role,
        subtitle: organizations[job.org].name + (job.client ? ` · ${organizations[job.client].name}` : ''),
        period: job.period,
        periodLabel: `${formatPeriod(job.period, ui)} · ${formatDuration(job.period, ui)}`,
        current: !job.period[1],
        action: () => focusJob(job.id)
      }))
    }
  ]
})

// Sin selección se muestra el puesto actual, para que el panel nunca quede vacío.
const hoveredItem = computed(() => {
  const items = lanes.value.flatMap((lane) => lane.items)
  return items.find((i) => i.id === hovered.value) ?? items.find((i) => i.current) ?? null
})
</script>

<template>
  <div class="timeline">
    <div class="timeline-head">
      <h3 class="timeline-title">{{ content.ui.timeline.title }}</h3>
      <p class="timeline-hint">{{ content.ui.timeline.hint }}</p>
    </div>

    <div class="chart" @mouseleave="hovered = null">
      <div v-for="lane in lanes" :key="lane.key" class="lane">
        <span class="lane-label">{{ lane.label }}</span>
        <div class="track">
          <button
            v-for="item in lane.items"
            :key="item.id"
            type="button"
            class="segment"
            :class="{ current: item.current, active: hovered === item.id }"
            :style="position(item.period)"
            :aria-label="`${item.title}, ${item.subtitle}, ${item.periodLabel}`"
            @mouseenter="hovered = item.id"
            @focus="hovered = item.id"
            @blur="hovered = null"
            @click="item.action"
          >
            <OrgLogo :org="item.org" size="sm" />
          </button>
        </div>
      </div>

      <div class="axis">
        <span class="lane-label" aria-hidden="true"></span>
        <div class="axis-track">
          <span
            v-for="year in years"
            :key="year"
            class="tick"
            :style="{ left: `${((year * 12 - range.start) / (range.end - range.start)) * 100}%` }"
          >
            {{ year }}
          </span>
        </div>
      </div>
    </div>

    <div class="detail" aria-live="polite">
      <Transition name="fade" mode="out-in">
        <div v-if="hoveredItem" :key="hoveredItem.id" class="detail-inner">
          <OrgLogo :org="hoveredItem.org" size="md" />
          <div>
            <p class="detail-title">{{ hoveredItem.title }}</p>
            <p class="detail-sub">{{ hoveredItem.subtitle }}</p>
            <p class="detail-period">{{ hoveredItem.periodLabel }}</p>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  margin-top: 2.5rem;
}

.timeline-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin-bottom: 1.25rem;
}

.timeline-title {
  margin: 0;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.timeline-hint {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.lane,
.axis {
  display: grid;
  grid-template-columns: 7rem 1fr;
  align-items: center;
  gap: 1rem;
}

.lane + .lane {
  margin-top: 0.75rem;
}

.lane-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  text-align: right;
}

.track {
  position: relative;
  height: 2.5rem;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.2);
}

.segment {
  position: absolute;
  top: 0.3rem;
  bottom: 0.3rem;
  display: flex;
  align-items: center;
  min-width: 2.2rem;
  padding: 0 0.3rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 6px;
  background: var(--menu-bg);
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
}

.segment.current {
  background: linear-gradient(90deg, var(--menu-bg), #777);
}

.segment:hover,
.segment.active,
.segment:focus-visible {
  background: #6a6a6a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
  z-index: 1;
}

.segment :deep(.org-logo--sm) {
  width: 1.5rem;
  height: 1.5rem;
}

.axis {
  margin-top: 0.4rem;
}

.axis-track {
  position: relative;
  height: 1.25rem;
}

.tick {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.detail {
  min-height: 5.5rem;
  margin-top: 1rem;
}

.detail-inner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  background: var(--card-head);
}

.detail-title {
  margin: 0;
  font-weight: 600;
}

.detail-sub,
.detail-period {
  margin: 0.15rem 0 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .lane,
  .axis {
    grid-template-columns: 1fr;
    gap: 0.3rem;
  }
  .lane-label {
    text-align: left;
  }
  .axis .lane-label {
    display: none;
  }
  .tick:nth-child(even) {
    display: none;
  }
}
</style>
