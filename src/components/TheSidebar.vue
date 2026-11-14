<script setup>
import { computed, ref, watch } from 'vue'
import { useLocale } from '../composables/useLocale.js'
import { useScrollSpy } from '../composables/useScrollSpy.js'
import links from '../content/links.js'
import { useMode } from '../composables/useMode.js'
import SocialIcon from './SocialIcon.vue'
import ModeSwitch from './ModeSwitch.vue'

const { content, locale, locales, setLocale } = useLocale()
const { mode } = useMode()

const navItems = computed(() => {
  const nav = { ...content.value.ui.nav, ...content.value.creative.nav, assistant: content.value.ai.nav }
  const ids = ['summary', 'assistant', 'experience', 'skills']
  if (content.value.projects.length) ids.push('projects')
  if (mode.value === 'creative') ids.push('lab')
  ids.push('education')
  if (mode.value === 'creative') ids.push('hobbies')
  ids.push('contact')
  return ids.map((id) => ({ id, label: nav[id] }))
})

const { activeId } = useScrollSpy(computed(() => navItems.value.map((item) => item.id)))

// En móvil el menú es una barra horizontal: la desplazamos para que se vea la sección activa.
const menuRef = ref(null)
watch(activeId, (id) => {
  const menu = menuRef.value
  const item = menu?.querySelector(`[href="#${id}"]`)
  if (!item || menu.scrollWidth <= menu.clientWidth) return
  menu.scrollTo({ left: item.offsetLeft - (menu.clientWidth - item.offsetWidth) / 2, behavior: 'smooth' })
})
</script>

<template>
  <aside class="sidebar">
    <div class="identity">
      <a href="#summary" class="monogram" aria-hidden="true" tabindex="-1">JMV</a>
      <div class="identity-text">
        <p class="name">{{ content.profile.name }}</p>
        <p class="role">{{ content.profile.role }}</p>
      </div>
    </div>

    <nav ref="menuRef" class="menu" :aria-label="content.ui.nav.summary">
      <ul class="menu-list">
        <li v-for="item in navItems" :key="item.id">
          <a
            :href="`#${item.id}`"
            class="menu-item"
            :class="{ active: activeId === item.id }"
            :aria-current="activeId === item.id ? 'true' : undefined"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <ModeSwitch />
      <div class="lang-switch" role="group" aria-label="Idioma / Language">
        <button
          v-for="lang in locales"
          :key="lang"
          type="button"
          :class="{ active: locale === lang }"
          :aria-pressed="locale === lang"
          @click="setLocale(lang)"
        >
          {{ lang.toUpperCase() }}
        </button>
      </div>
      <div class="social">
        <a :href="links.linkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <SocialIcon name="linkedin" />
        </a>
        <a :href="links.github" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <SocialIcon name="github" />
        </a>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: var(--sidebar-width);
  padding: 4rem 0 2rem;
  background: var(--sidebar-bg);
  overflow-y: auto;
  transition: background 0.5s ease;
}

.identity {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 0 1rem;
  text-align: center;
}

.monogram {
  display: grid;
  place-items: center;
  width: 8.5rem;
  height: 8.5rem;
  border-radius: 30%;
  background: var(--card-head);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-decoration: none;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s ease;
}

.monogram:hover {
  transform: rotate(-4deg) scale(1.03);
}

.name {
  margin: 0;
  color: var(--sidebar-text);
  font-weight: 700;
  font-size: 1.05rem;
  line-height: 1.3;
}

.role {
  margin: 0.25rem 0 0;
  color: var(--sidebar-text-soft);
  font-size: 0.85rem;
  font-weight: 500;
}

.menu {
  width: 100%;
  margin: 3rem 0 2rem;
}

.menu-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.menu-item {
  position: relative;
  display: block;
  margin: 0.6rem auto;
  width: 78%;
  padding: 0.7rem 1.25rem;
  background: var(--menu-bg);
  color: #fff;
  text-align: center;
  text-decoration: none;
  font-weight: 500;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.menu-item:hover {
  width: 100%;
  background: var(--menu-hover);
}

.menu-item.active {
  width: 100%;
  background: var(--card-head);
}

.menu-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #fff;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
}

.lang-switch {
  display: flex;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--sidebar-text-soft);
}

.lang-switch button {
  padding: 0.4rem 0.9rem;
  border: 0;
  background: transparent;
  color: var(--sidebar-text-soft);
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.lang-switch button.active {
  background: var(--menu-bg);
  color: #fff;
}

.lang-switch button:not(.active):hover {
  background: rgba(0, 0, 0, 0.08);
}

.social {
  display: flex;
  gap: 1rem;
  font-size: 1.3rem;
}

.social a {
  display: flex;
  color: var(--sidebar-text-soft);
  transition: color 0.2s, transform 0.2s;
}

.social a:hover {
  color: var(--sidebar-text);
  transform: translateY(-2px);
}

/* ---------- Móvil: barra superior, como en la versión original ---------- */
@media (max-width: 1069px) {
  .sidebar {
    position: sticky;
    inset: 0 0 auto 0;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1rem 0;
    overflow: visible;
  }

  .identity {
    flex-direction: row;
    gap: 0.75rem;
    padding: 0;
    text-align: left;
  }

  .monogram {
    width: 2.75rem;
    height: 2.75rem;
    font-size: 0.85rem;
    box-shadow: none;
  }

  .sidebar-footer {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.5rem;
    margin: 0 0 0 auto;
  }

  .social {
    display: none;
  }

  .menu {
    order: 3;
    margin: 0.75rem -1rem 0;
    width: calc(100% + 2rem);
    overflow-x: auto;
    scrollbar-width: none;
  }

  .menu-list {
    display: flex;
  }

  .menu-list li {
    flex: 1 0 auto;
  }

  .menu-item,
  .menu-item:hover,
  .menu-item.active {
    width: auto;
    margin: 0;
    padding: 0.65rem 1rem;
    white-space: nowrap;
    font-size: 0.9rem;
  }

  .menu-item.active::before {
    inset: auto 0 0 0;
    width: auto;
    height: 4px;
  }
}

@media (max-width: 480px) {
  .role {
    display: none;
  }
}
</style>
