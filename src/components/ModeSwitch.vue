<script setup>
import { useLocale } from '../composables/useLocale.js'
import { useMode } from '../composables/useMode.js'

const { content } = useLocale()
const { mode, modes, setMode } = useMode()
</script>

<template>
  <div class="mode-switch" role="group" :aria-label="content.creative.modeLabel">
    <button
      v-for="value in modes"
      :key="value"
      type="button"
      :class="[`mode--${value}`, { active: mode === value }]"
      :aria-pressed="mode === value"
      @click="setMode(value)"
    >
      <span aria-hidden="true">{{ value === 'formal' ? '◼' : '✦' }}</span>
      {{ content.creative.modes[value] }}
    </button>
  </div>
</template>

<style scoped>
.mode-switch {
  display: flex;
  padding: 3px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.12);
}

button {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.85rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--sidebar-text-soft);
  font: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}

button.active.mode--formal {
  background: var(--menu-bg);
  color: #fff;
}

button.active.mode--creative {
  background: linear-gradient(90deg, var(--c-pink), var(--c-orange), var(--c-yellow));
  color: #1a1a1a;
}

button:not(.active):hover {
  color: var(--sidebar-text);
}
</style>
