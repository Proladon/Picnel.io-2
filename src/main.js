import Vue from "vue";
import App from "./App.vue";
import store from "./store";
//:: Module | Components
import Viewer from "v-viewer";
import VModal from "vue-js-modal";
import VNotifications from "vue-notification";
import velocity from "velocity-animate";
import VueLazyload from 'vue-lazyload'
import './assets/func/bus'

Vue.config.productionTip = false;
Vue.use(Viewer);
Vue.use(VNotifications, { velocity });
Vue.use(VModal, {
    dynamicDefaults: {
        draggable: true,
        //  resizable: true,
        height: "auto",
    },
    dialog: true,
});
Vue.use(VueLazyload, {
    observer: true,
    observerOptions: {
        rootMargin: '0px',
        threshold: 0.1
    }
    // preLoad: 1.3,
    // error: 'dist/error.png',
    // loading: 'dist/loading.gif',
    // attempt: 1
  })
new Vue({
    store,
    render: (h) => h(App),
}).$mount("#app");
