import Vue from 'vue'
import App from './App.vue'
import store from './store'
//:: Module | Components
import Viewer from 'v-viewer'
import VModal from 'vue-js-modal'

Vue.config.productionTip = false
Vue.use(Viewer)
Vue.use(VModal, {
    dynamicDefaults: {
      draggable: true,
    //   resizable: true,
      height: 'auto'
    }
  })
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
