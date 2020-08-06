import Vue from 'vue'
import App from './App.vue'
import store from './store'
import Viewer from 'v-viewer'

Vue.config.productionTip = false
Vue.use(Viewer)
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
