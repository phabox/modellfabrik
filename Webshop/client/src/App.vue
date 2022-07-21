<template>
  <div class="container-fluid">
    <div class="col-12">
      <PageHeader />
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import PageHeader from "./components/shared/PageHeader";

import {
  GET_SETTINGS,
  GET_ORDERS,
  GET_STOCK,
  ORDER_CREATED,
  ORDER_CHANGED,
  STOCK_CHANGED,
} from "./constants/graphql";

/**
 * Main component of the webshop. This view bundles all other views as subcomponents.
 * The {@link PageHeader} component with navigation to the other views is always shown.
 * Based on the selected route the corresponding Router-View is displayed.
 * Since this is the central component of the wbeshop which is always alive, it is also responsible of fetching and listening to data from the backend-server.
 * This way we avoid fetching and subscribing data too often when subcomponents are destroyed and recreated based on the route.
 *
 * @category Webshop
 * 
 * @vue-computed {Object} settings - The cylinder property settings including available heights and colors
 * @vue-computed {string} fetchSettingsError - Error that occured when fetching the cylinder-settings from the backend server
 */
export default {
  name: "App",
  components: {
    PageHeader,
  },

  mounted() {
    this.$apollo
      .query({
        query: GET_SETTINGS,
      })
      .then((result) => {
        this.$store.commit("setSettings", result.data.settings);
        this.$store.commit("setFetchSettingsError", null);
      })
      .catch((error) => {
        this.$store.commit("setFetchSettingsError", String(error));
      });

    this.$apollo
      .query({
        query: GET_ORDERS,
        variables: {
          page: 1,
          limit: 100,
        },
      })
      .then((result) => {
        this.$store.commit("setOrders", result.data.orders);
        this.$store.commit("setFetchOrdersError", null);
      })
      .catch((error) => {
        this.$store.commit("setFetchOrdersError", String(error));
      });

    this.$apollo
      .query({
        query: GET_STOCK,
      })
      .then((result) => {
        this.$store.commit("setStock", result.data.stock);
      })
      .catch((error) => {
        console.log(error);
      });

    const orderCreatedObserver = this.$apollo.subscribe({
      query: ORDER_CREATED,
    });
    const orderChangedObserver = this.$apollo.subscribe({
      query: ORDER_CHANGED,
    });
    const stockChangedObserver = this.$apollo.subscribe({
      query: STOCK_CHANGED,
    });

    orderCreatedObserver.subscribe({
      next: (result) => {
        this.$store.commit("addOrder", result.data.orderCreated);
      },
      error: (error) => {
        console.error(error);
      },
    });
    orderChangedObserver.subscribe({
      next: (result) => {
        this.$store.commit("updateOrder", result.data.orderChanged);
      },
      error: (error) => {
        console.error(error);
      },
    });
    stockChangedObserver.subscribe({
      next: (result) => {
        this.$store.commit("setStock", result.data.stockChanged);
      },
      error: (error) => {
        console.error(error);
      },
    });
  },
};
</script>
