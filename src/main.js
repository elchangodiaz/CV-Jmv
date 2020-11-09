import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

Vue.config.productionTip = false

//use beforeEach route guard to set the lenguage
router.beforeEach((to, from, next) => {
  let lenguage = to.params.lang;
  if(!lenguage){
    lenguage = 'es'
  }

  i18n.locale = lenguage
  next()
})

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
