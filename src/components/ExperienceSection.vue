<script setup>
import { useLocale } from '../composables/useLocale.js'
import { useCvState } from '../composables/useCvState.js'
import ExperienceItem from './ExperienceItem.vue'

const { content } = useLocale()
const { selectedSkill, clearSkill } = useCvState()
</script>

<template>
  <section id="experience" class="card" aria-labelledby="experience-title">
    <header class="card-title">
      <h2 id="experience-title">{{ content.ui.sections.experience }}</h2>
    </header>

    <div class="card-body">
      <Transition name="slide">
        <div v-if="selectedSkill" class="filter-bar" role="status">
          <span>
            {{ content.ui.filteringBy }} <strong>{{ selectedSkill }}</strong>
          </span>
          <button type="button" class="clear" @click="clearSkill">{{ content.ui.clearFilter }} ✕</button>
        </div>
      </Transition>

      <ExperienceItem v-for="job in content.experience" :key="job.id" :job="job" />
    </div>
  </section>
</template>

<style scoped>
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: #fff;
  color: var(--card-head);
  font-size: 0.9rem;
}

.clear {
  padding: 0.3rem 0.7rem;
  border: 1px solid var(--card-head);
  border-radius: 6px;
  background: transparent;
  color: var(--card-head);
  font: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.clear:hover {
  background: var(--card-head);
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
</style>
