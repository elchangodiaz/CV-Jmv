<script setup>
import { computed } from 'vue'
import organizations from '../content/organizations.js'

const props = defineProps({
  org: { type: String, required: true },
  size: { type: String, default: 'md', validator: (v) => ['sm', 'md', 'lg'].includes(v) }
})

const data = computed(() => organizations[props.org])
</script>

<template>
  <span v-if="data" class="org-logo" :class="`org-logo--${size}`" :title="data.name">
    <img v-if="data.logo" :src="data.logo" :alt="data.name" loading="lazy" />
    <span v-else class="initials" aria-hidden="true">{{ data.initials }}</span>
    <span v-if="!data.logo" class="visually-hidden">{{ data.name }}</span>
  </span>
</template>

<style scoped>
.org-logo {
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

.org-logo--sm {
  width: 1.75rem;
  height: 1.75rem;
  padding: 0.2rem;
  border-radius: 6px;
}

.org-logo--md {
  width: 3.25rem;
  height: 3.25rem;
  padding: 0.4rem;
}

.org-logo--lg {
  width: 5rem;
  height: 5rem;
  padding: 0.55rem;
  border-radius: 10px;
}

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.initials {
  color: #333;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.org-logo--sm .initials {
  font-size: 0.6rem;
}
.org-logo--md .initials {
  font-size: 1rem;
}
.org-logo--lg .initials {
  font-size: 1.4rem;
}
</style>
