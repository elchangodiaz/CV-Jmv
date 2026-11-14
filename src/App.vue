<script setup>
import { defineAsyncComponent, ref, watch } from 'vue'
import { useLocale } from './composables/useLocale.js'
import { useMode } from './composables/useMode.js'
import TheSidebar from './components/TheSidebar.vue'
import SummarySection from './components/SummarySection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import EducationSection from './components/EducationSection.vue'
import ContactSection from './components/ContactSection.vue'
import AssistantSection from './components/AssistantSection.vue'

// El modo creativo se descarga solo cuando se activa, así el modo formal sigue ligero.
const LabSection = defineAsyncComponent(() => import('./components/creative/LabSection.vue'))
const HobbiesSection = defineAsyncComponent(() => import('./components/creative/HobbiesSection.vue'))

const { content } = useLocale()
const { mode } = useMode()
const year = new Date().getFullYear()

const toast = ref(false)
let toastTimer = 0
watch(mode, (value) => {
  clearTimeout(toastTimer)
  toast.value = value === 'creative'
  if (toast.value) toastTimer = setTimeout(() => (toast.value = false), 4000)
})
</script>

<template>
  <a class="skip-link" href="#main">{{ content.ui.skipLink }}</a>
  <TheSidebar />
  <main id="main" class="view-container">
    <SummarySection v-reveal />
    <AssistantSection v-reveal />
    <ExperienceSection v-reveal />
    <SkillsSection v-reveal />
    <ProjectsSection v-if="content.projects.length" v-reveal />
    <LabSection v-if="mode === 'creative'" />
    <EducationSection v-reveal />
    <HobbiesSection v-if="mode === 'creative'" />
    <ContactSection v-reveal />
    <footer class="footer">© {{ year }} {{ content.profile.name }} · {{ content.ui.footer }}</footer>
  </main>

  <Transition name="toast">
    <div v-if="toast" class="toast" role="status">
      <span aria-hidden="true">✦</span> {{ content.creative.toast }}
      <a href="#lab" @click="toast = false">→</a>
    </div>
  </Transition>
</template>
