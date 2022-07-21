import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import routes from "./router/routes";

import VueRouter from "vue-router";
import VueSweetalert2 from "vue-sweetalert2";
import { BootstrapVue } from "bootstrap-vue";

import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import VueApollo from "vue-apollo";
import fetch from "node-fetch";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faClock, faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import StatusIndicator from "vue-status-indicator";
import VueResizeObserver from "vue-resize-observer";

library.add(faClock, faCheckCircle, faWrench);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(VueSweetalert2);
Vue.use(StatusIndicator);
Vue.use(VueResizeObserver);

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: process.env.VUE_APP_BACKEND_HTTP_LINK,
  fetch: fetch,
});

const wsLink = new WebSocketLink({
  uri: process.env.VUE_APP_BACKEND_WS_LINK,
  options: {
    reconnect: true,
  },
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
  defaultOptions: {
    query: {
      fetchPolicy: "network-only",
    },
  },
});
Vue.use(VueApollo);
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $loadingKey: "loading",
  },
});

export const EventBus = new Vue();
const router = new VueRouter({ routes });

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  apolloProvider,
  render: (h) => h(App),
}).$mount("#app");
