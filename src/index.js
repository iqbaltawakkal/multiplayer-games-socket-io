import Vue from "vue";
import router from "./router";
import App from "./App.vue";
import store from "./store/store.js";
import BootstrapVue from "bootstrap-vue";
import MockupIO from "./mockup.js";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./style/app.css";

Vue.use(BootstrapVue);
Vue.config.devtools = true;

try {
  window.socket = io(); // eslint-disable-line no-undef
} catch (err) {
  window.socket = MockupIO; // for UI development using webpack
  window.socket.populateMock(store);
}

Vue.prototype.$socketio = window.socket;
Vue.prototype.$connection = true;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
