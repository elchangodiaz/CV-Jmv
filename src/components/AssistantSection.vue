<script setup>
import { ref } from 'vue'
import { useLocale } from '../composables/useLocale.js'
import AiChat from './ai/AiChat.vue'
import AiJobMatch from './ai/AiJobMatch.vue'

const { content } = useLocale()

const tabs = [
  { id: 'chat', component: AiChat },
  { id: 'match', component: AiJobMatch }
]
const active = ref('chat')
const tabRefs = ref([])

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
  <section id="assistant" class="card" aria-labelledby="assistant-title">
    <header class="card-title">
      <h2 id="assistant-title"><span class="spark" aria-hidden="true">✦</span> {{ content.ai.title }}</h2>
    </header>

    <div class="card-body">
      <p class="intro">{{ content.ai.intro }}</p>

      <div class="tabs" role="tablist" :aria-label="content.ai.title">
        <button
          v-for="(tab, index) in tabs"
          :id="`ai-tab-${tab.id}`"
          :key="tab.id"
          ref="tabRefs"
          type="button"
          role="tab"
          class="tab"
          :aria-selected="active === tab.id"
          :aria-controls="`ai-panel-${tab.id}`"
          :tabindex="active === tab.id ? 0 : -1"
          @click="active = tab.id"
          @keydown="onKeydown($event, index)"
        >
          {{ content.ai.tabs[tab.id] }}
        </button>
      </div>

      <!-- v-show conserva la conversación y el análisis al cambiar de pestaña -->
      <div
        v-for="tab in tabs"
        v-show="active === tab.id"
        :id="`ai-panel-${tab.id}`"
        :key="tab.id"
        role="tabpanel"
        class="panel"
        :aria-labelledby="`ai-tab-${tab.id}`"
      >
        <component :is="tab.component" />
      </div>

      <p class="disclaimer">{{ content.ai.disclaimer }}</p>
    </div>
  </section>
</template>

<style scoped>
.spark {
  color: var(--c-yellow);
}

.intro {
  max-width: 75ch;
  margin: 0 0 1.5rem;
  line-height: 1.7;
}

.disclaimer {
  margin: 1.5rem 0 0;
  font-size: 0.78rem;
  color: var(--text-muted);
}
</style>
