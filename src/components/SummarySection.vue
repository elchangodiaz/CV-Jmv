<script setup>
import { useLocale } from '../composables/useLocale.js'
import StatCounter from './StatCounter.vue'
import CareerTimeline from './CareerTimeline.vue'

const { content } = useLocale()
</script>

<template>
  <section id="summary" class="card" aria-labelledby="summary-title">
    <header class="card-title">
      <div class="title-text">
        <h3 id="summary-title" class="eyebrow">{{ content.ui.sections.summary }}</h3>
        <h1>{{ content.profile.name }}</h1>
        <h4>{{ content.profile.role }}</h4>
        <p class="tagline">{{ content.profile.tagline }}</p>
        <p class="location">{{ content.profile.location }}</p>
      </div>
    </header>

    <div class="card-body">
      <p v-for="(paragraph, i) in content.profile.summary" :key="i" class="summary">{{ paragraph }}</p>

      <div class="stats">
        <StatCounter
          v-for="item in content.highlights"
          :key="item.label"
          :value="item.value"
          :label="item.label"
        />
      </div>

      <CareerTimeline />
    </div>
  </section>
</template>

<style scoped>
.title-text h1 {
  margin: 0.2rem 0 0;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  line-height: 1.15;
}

.title-text h4 {
  margin: 0.4rem 0 0;
  font-size: 1.15rem;
  font-weight: 500;
}

.tagline {
  margin: 0.75rem 0 0;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.location {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.summary {
  max-width: 75ch;
  margin: 0 0 1rem;
  line-height: 1.75;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}

@media (max-width: 900px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
