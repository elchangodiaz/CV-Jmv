<script setup>
import { computed, ref } from 'vue'
import { useLocale } from '../../composables/useLocale.js'
import MtbJump from './MtbJump.vue'
import PenaltyGame from './PenaltyGame.vue'
import CatBuddy from './CatBuddy.vue'

const { content } = useLocale()
const lab = computed(() => content.value.creative.lab)

const tabs = [
  { id: 'mtb', component: MtbJump },
  { id: 'soccer', component: PenaltyGame },
  { id: 'cat', component: CatBuddy }
]
const active = ref('mtb')
const tabRefs = ref([])

// Navegación con flechas entre pestañas (patrón ARIA tabs).
function onKeydown(event, index) {
  const keys = { ArrowRight: 1, ArrowLeft: -1 }
  if (!(event.key in keys)) return
  event.preventDefault()
  const next = (index + keys[event.key] + tabs.length) % tabs.length
  active.value = tabs[next].id
  tabRefs.value[next]?.focus()
}
</script>

<template>
  <section id="lab" class="card lab" aria-labelledby="lab-title">
    <header class="card-title">
      <h2 id="lab-title">{{ lab.title }}</h2>
    </header>

    <div class="card-body">
      <p class="intro">{{ lab.intro }}</p>

      <div class="tabs" role="tablist" :aria-label="lab.title">
        <button
          v-for="(tab, index) in tabs"
          :id="`tab-${tab.id}`"
          :key="tab.id"
          ref="tabRefs"
          type="button"
          role="tab"
          class="tab"
          :class="`tab--${tab.id}`"
          :aria-selected="active === tab.id"
          :aria-controls="`panel-${tab.id}`"
          :tabindex="active === tab.id ? 0 : -1"
          @click="active = tab.id"
          @keydown="onKeydown($event, index)"
        >
          {{ lab.tabs[tab.id] }}
        </button>
      </div>

      <div
        v-for="tab in tabs"
        v-show="active === tab.id"
        :id="`panel-${tab.id}`"
        :key="tab.id"
        role="tabpanel"
        class="panel"
        :aria-labelledby="`tab-${tab.id}`"
      >
        <component :is="tab.component" v-if="active === tab.id" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.intro {
  max-width: 75ch;
  margin: 0 0 1.75rem;
  line-height: 1.7;
}

.tab--mtb {
  --tab-color: var(--c-teal);
}
.tab--soccer {
  --tab-color: var(--c-pink);
}
.tab--cat {
  --tab-color: var(--c-yellow);
}

</style>
