<script setup>
import { computed } from 'vue'
import { useLocale } from '../../composables/useLocale.js'

const { content } = useLocale()
const t = computed(() => content.value.creative.hobbies)
const colors = ['--c-teal', '--c-blue', '--c-yellow', '--c-pink', '--c-purple', '--c-orange']
</script>

<template>
  <section id="hobbies" class="card" aria-labelledby="hobbies-title">
    <header class="card-title">
      <h2 id="hobbies-title">{{ t.title }}</h2>
    </header>

    <div class="card-body">
      <p class="intro">{{ t.intro }}</p>

      <ul class="hobbies">
        <li
          v-for="(item, index) in t.items"
          :key="item.title"
          class="hobby"
          :style="{ '--hobby-color': `var(${colors[index % colors.length]})` }"
          tabindex="0"
        >
          <span class="icon" aria-hidden="true">{{ item.icon }}</span>
          <span class="hobby-title">{{ item.title }}</span>
          <span class="hobby-text">{{ item.text }}</span>
        </li>
      </ul>

      <h3 class="facts-title">{{ t.factsTitle }}</h3>
      <ul class="facts">
        <li v-for="(fact, index) in t.facts" :key="index">{{ fact }}</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.intro {
  margin: 0 0 1.5rem;
}

.hobbies {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.hobby {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 1.5rem 1rem;
  border-radius: 12px;
  border-bottom: 4px solid var(--hobby-color);
  background: var(--card-head);
  text-align: center;
  transition: transform 0.25s, box-shadow 0.25s;
}

.hobby:hover,
.hobby:focus-visible {
  transform: translateY(-6px);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--hobby-color) 35%, transparent);
}

.icon {
  font-size: 2.4rem;
  line-height: 1;
  transition: transform 0.4s;
}

.hobby:hover .icon,
.hobby:focus-visible .icon {
  transform: rotate(-12deg) scale(1.2);
}

.hobby-title {
  font-weight: 700;
  color: var(--hobby-color);
}

.hobby-text {
  font-size: 0.85rem;
  color: var(--text-soft);
}

.facts-title {
  margin: 2rem 0 0.75rem;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.facts {
  margin: 0;
  padding-left: 1.2rem;
}

.facts li {
  margin-bottom: 0.5rem;
  color: var(--text-soft);
}

.facts li::marker {
  content: '✦  ';
  color: var(--c-yellow);
}
</style>
