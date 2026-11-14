<script setup>
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale.js'
import { useCvState } from '../composables/useCvState.js'
import { formatPeriod } from '../utils/dates.js'
import organizations from '../content/organizations.js'
import OrgLogo from './OrgLogo.vue'

const { content } = useLocale()
const { selectedSkill, jobsBySkill, isLinkedSkill, selectSkill, focusJob } = useCvState()

const usedIn = computed(() => (selectedSkill.value ? jobsBySkill.value.get(selectedSkill.value) ?? [] : []))
</script>

<template>
  <section id="skills" class="card" aria-labelledby="skills-title">
    <header class="card-title">
      <h2 id="skills-title">{{ content.ui.sections.skills }}</h2>
    </header>

    <div class="card-body">
      <p class="hint">{{ content.ui.skillsHint }}</p>

      <table class="skills-table">
        <thead>
          <tr>
            <th scope="col">{{ content.ui.skillsTable.area }}</th>
            <th scope="col">{{ content.ui.skillsTable.tech }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="group in content.skills" :key="group.group">
            <th scope="row">
              {{ group.group }}
              <span v-if="group.note" class="note">{{ group.note }}</span>
            </th>
            <td>
              <ul class="chips">
                <li v-for="item in group.items" :key="item">
                  <button
                    v-if="isLinkedSkill(item)"
                    type="button"
                    class="chip chip-button linked"
                    :class="{ selected: selectedSkill === item }"
                    :aria-pressed="selectedSkill === item"
                    @click="selectSkill(item)"
                  >
                    {{ item }}
                  </button>
                  <span v-else class="chip">{{ item }}</span>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>

      <Transition name="slide">
        <div v-if="selectedSkill" class="used-in" role="status">
          <p class="used-in-title">{{ content.ui.usedIn(selectedSkill) }}</p>
          <ul class="used-in-list">
            <li v-for="job in usedIn" :key="job.id">
              <button type="button" class="used-in-item" @click="focusJob(job.id)">
                <OrgLogo :org="job.org" size="md" />
                <span class="used-in-text">
                  <span class="used-in-role">{{ job.role }}</span>
                  <span class="used-in-meta">
                    {{ organizations[job.org].name }} · {{ formatPeriod(job.period, content.ui) }}
                  </span>
                </span>
                <span class="arrow" aria-hidden="true">→</span>
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.hint {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Tabla con bordes blancos, como en la versión original */
.skills-table {
  width: 100%;
  margin: 1.5rem 0 0;
  border-spacing: 0;
}

.skills-table th,
.skills-table td {
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-top: none;
  vertical-align: middle;
}

.skills-table th:first-child,
.skills-table td:first-child {
  border-left: none;
}

.skills-table th:last-child,
.skills-table td:last-child {
  border-right: none;
}

.skills-table tbody tr:last-child th,
.skills-table tbody tr:last-child td {
  border-bottom: none;
}

.skills-table thead th {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.skills-table tbody th {
  width: 26%;
  text-align: center;
  font-weight: 600;
}

.note {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-muted);
}

.linked::before {
  content: '•';
  margin-right: 0.35rem;
  color: #fff;
}

.used-in {
  margin-top: 1.75rem;
  padding: 1.25rem;
  border-radius: 10px;
  background: var(--card-head);
}

.used-in-title {
  margin: 0 0 0.9rem;
  font-weight: 600;
}

.used-in-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.used-in-item {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: var(--card-bg);
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;
}

.used-in-item:hover {
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
}

.used-in-text {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.used-in-role {
  font-weight: 600;
  font-size: 0.95rem;
}

.used-in-meta {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.arrow {
  color: var(--text-muted);
  transition: transform 0.2s;
}

.used-in-item:hover .arrow {
  transform: translateX(3px);
  color: #fff;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 640px) {
  .skills-table thead {
    display: none;
  }
  .skills-table tr {
    display: block;
    border-bottom: 1px solid rgba(255, 255, 255, 0.8);
  }
  .skills-table tbody tr:last-child {
    border-bottom: none;
  }
  .skills-table th,
  .skills-table td {
    display: block;
    width: auto !important;
    border: none !important;
    padding: 0.75rem 0;
    text-align: left !important;
  }
  .skills-table td {
    padding-top: 0;
  }
}
</style>
