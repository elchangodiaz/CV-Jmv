<script setup>
import { useLocale } from '../composables/useLocale.js'
import SocialIcon from './SocialIcon.vue'

const { content } = useLocale()
</script>

<template>
  <section id="projects" class="card" aria-labelledby="projects-title">
    <header class="card-title">
      <h2 id="projects-title">{{ content.ui.sections.projects }}</h2>
    </header>

    <div class="card-body grid">
      <article v-for="project in content.projects" :key="project.name" class="project">
        <h3>{{ project.name }}</h3>
        <p>{{ project.description }}</p>
        <ul class="chips">
          <li v-for="tech in project.tech" :key="tech" class="chip">{{ tech }}</li>
        </ul>
        <a v-if="project.url" :href="project.url" target="_blank" rel="noopener noreferrer" class="link">
          <SocialIcon name="github" /> {{ content.ui.viewCode }}
        </a>
      </article>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1rem;
}

.project {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border-radius: 10px;
  background: var(--card-head);
}

.project h3,
.project p {
  margin: 0;
}

.project p {
  color: var(--text-soft);
}

.link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: auto;
  color: #fff;
  font-weight: 600;
}
</style>
