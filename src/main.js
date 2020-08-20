import Vue from "vue";
import App from "./App.vue";
import store from "./store";
//:: Module | Components
import Viewer from "v-viewer";
import VModal from "vue-js-modal";
import VNotifications from "vue-notification";
import velocity from "velocity-animate";

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
new Vue({
    store,
    render: (h) => h(App),
}).$mount("#app");
