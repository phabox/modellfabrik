<template>
  <b-container fluid>
    <b-row v-if="orders && orders.length > 0" class="h-100">
      <b-col xl="6">
        <OrderList />
      </b-col>

      <b-col v-if="selectedOrder" xl="6" class="h-100" align-self="stretch">
        <OrderPreview />
      </b-col>
    </b-row>
    <div v-else-if="fetchOrdersError">
      <Error v-bind:errorMessage="fetchOrdersError" />
    </div>
  </b-container>
</template>

<script>
import OrderList from "../components/orders/OrderList";
import OrderPreview from "../components/orders/OrderPreview";
import Error from "../components/shared/Error";

import { mapGetters } from "vuex";

/**
 * View that bundles the order components. Shows a list of multiple orders.
 * If an order was selected, the preview component will be displayed.
 * If the orders couldn't be fetched due to an error, the {@link Error} component
 * will be shown with the GraphQL error message.
 *
 * @category Views
 * @vue-computed {string} selectedOrder - ID of the currently selected order
 * @vue-computed {Object[]} orders - Array containing all placed orders
 * @vue-computed {string} fetchOrderError - Error that occured when fetching the orders from the backend server
 */
export default {
  name: "Orders",
  components: {
    OrderList,
    OrderPreview,
    Error,
  },

  computed: {
    ...mapGetters(["orders", "fetchOrdersError", "selectedOrder"]),
  },
};
</script>

<style scoped>
.container-fluid {
  height: 60vh;
}
</style>
