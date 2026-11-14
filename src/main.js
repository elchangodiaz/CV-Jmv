import { createApp } from 'vue'
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
import App from './App.vue'
import reveal from './directives/reveal.js'
import './styles/main.css'

createApp(App).directive('reveal', reveal).mount('#app')
