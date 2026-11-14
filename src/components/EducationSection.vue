<script setup>
import { useLocale } from '../composables/useLocale.js'
import organizations from '../content/organizations.js'
import OrgLogo from './OrgLogo.vue'

const { content } = useLocale()
</script>

<template>
  <section id="education" class="card" aria-labelledby="education-title">
    <header class="card-title">
      <h2 id="education-title">{{ content.ui.sections.education }}</h2>
    </header>

    <div class="card-body">
      <article class="degree">
        <div class="logos">
          <a
            v-for="org in content.education.orgs"
            :key="org"
            :href="organizations[org].url"
            target="_blank"
            rel="noopener noreferrer"
            class="logo-link"
          >
            <OrgLogo :org="org" size="lg" />
          </a>
        </div>
        <div class="degree-text">
          <div class="degree-head">
            <h3>{{ content.education.degree }}</h3>
            <span class="years">{{ content.education.years }}</span>
          </div>
          <p class="school">{{ content.education.school }}</p>
          <p class="campus">{{ content.education.campus }}</p>
          <ul class="notes">
            <li v-for="(note, i) in content.education.notes" :key="i">{{ note }}</li>
          </ul>
        </div>
      </article>

      <h3 class="subheading">{{ content.ui.sections.languages }}</h3>
      <ul class="languages">
        <li v-for="lang in content.languages" :key="lang.name">
          <strong>{{ lang.name }}</strong> – {{ lang.level }}
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.degree {
  display: flex;
  gap: 1.75rem;
  padding: 1.5rem;
  border-radius: 10px;
  background: var(--card-head);
}

.logos {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.logo-link {
  display: block;
  border-radius: 10px;
  transition: transform 0.25s;
}

.logo-link:hover {
  transform: scale(1.06) rotate(-2deg);
}

.degree-text {
  flex: 1;
}

.degree-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
}

.degree-head h3 {
  margin: 0;
  font-size: 1.15rem;
}

.years {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.school {
  margin: 0.4rem 0 0;
  font-weight: 600;
}

.campus {
  margin: 0.1rem 0 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.notes {
  margin: 1rem 0 0;
  padding-left: 1.1rem;
  color: var(--text-soft);
}

.notes li {
  margin-bottom: 0.4rem;
}

.subheading {
  margin: 2rem 0 0.75rem;
  color: var(--text-muted);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.languages {
  margin: 0;
  padding: 0;
  list-style: none;
}

.languages li {
  margin-bottom: 0.5rem;
}

@media (max-width: 640px) {
  .degree {
    flex-direction: column;
  }
  .logos {
    flex-direction: row;
  }
}
</style>
