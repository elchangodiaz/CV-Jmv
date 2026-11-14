<script setup>
import { useLocale } from '../composables/useLocale.js'
import links from '../content/links.js'
import SocialIcon from './SocialIcon.vue'

const { content } = useLocale()
</script>

<template>
  <section id="contact" class="card" aria-labelledby="contact-title">
    <header class="card-title">
      <h2 id="contact-title">{{ content.ui.sections.contact }}</h2>
    </header>

    <div class="card-body">
      <p class="text">{{ content.ui.contactText }}</p>
      <div class="buttons">
        <a class="btn btn-primary" :href="links.linkedin" target="_blank" rel="noopener noreferrer">
          <SocialIcon name="linkedin" /> LinkedIn
        </a>
        <a class="btn" :href="links.github" target="_blank" rel="noopener noreferrer">
          <SocialIcon name="github" /> GitHub
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.text {
  margin: 0 0 1.5rem;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
</style>
