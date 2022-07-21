import Vue from "vue";
import { BootstrapVue } from "bootstrap-vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faClock, faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import StatusIndicator from "vue-status-indicator";

process.env = Object.assign(process.env, {
  VUE_APP_BACKEND_HTTP_LINK: 'http://localhost:3000/graphql',
});
process.env = Object.assign(process.env, {
  VUE_APP_BACKEND_WS_LINK: 'ws://localhost:3000/graphql',
});

Vue.use(BootstrapVue);

library.add(faClock, faCheckCircle, faWrench);
Vue.component("font-awesome-icon", FontAwesomeIcon);

createAppDiv();
function createAppDiv() {
  var app = document.createElement("div");
  app.setAttribute("id", "app");
  document.body.appendChild(app);
}
