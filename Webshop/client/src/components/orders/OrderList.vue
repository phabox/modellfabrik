<template>
  <div>
    <div v-for="order in currentList" :key="order._id">
      <b-row class="ml-1 justify-content-center">
        <b-col lg="10">
          <Order v-bind:order="order" />
        </b-col>
      </b-row>
    </div>
    <b-row class="ml-1 justify-content-center">
      <b-col lg="10">
        <b-pagination
          class="mt-3"
          :total-rows="orders.length"
          v-model="currentPage"
          :per-page="perPage"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Order from "./Order";

/**
 * This component displays all placed orders on multiple pages
 *
 * @category Orders
 * 
 * @vue-data {number} currentPage - The current page of the pagination component
 * @vue-data {number} perPage - Number of orders that are displayed on a single page

 * @vue-computed {Object[]} orders - Array containing all placed orders
 * @vue-computed {Object[]} currentList - List of orders displayed on the current page
 */
export default {
  name: "OrderList",
  components: {
    Order,
  },

  data() {
    return {
      currentPage: 1,
      perPage: 3,
    };
  },

  computed: {
    ...mapGetters(["orders"]),

    currentList() {
      return this.orders.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
    },
  },
};
</script>
