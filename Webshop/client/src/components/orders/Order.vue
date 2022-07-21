<template>
  <b-card
    :header="orderId"
    class="mt-3"
    v-on:click="toggleSelection"
    v-bind:class="{ cardHighlight: isSelected }"
  >
    <div class="media align-items-stretch">
      <div class="mr-5 w-50 align-self-center">
        <b-row v-if="orderName">
          <b-col>
            <span class="text-muted">Name: </span>
          </b-col>
          <b-col class="orderName">
            {{ orderName }}
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <span class="text-muted created">Erstellt: </span>
          </b-col>
          <b-col>
            {{ createdDate }}
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <span class="text-muted updated">Aktualisiert: </span>
          </b-col>
          <b-col>
            {{ updatedDate }}
          </b-col>
        </b-row>
      </div>

      <b-media-body class="align-self-center">
        <h5>{{ statusDescription }}</h5>
        <span class="numberOfParts">{{ numberOfParts }} Komponente(n)</span>
      </b-media-body>
      <div class="align-self-center">
        <font-awesome-icon
          v-if="order.status == OrderStatus.PENDING"
          :icon="['far', 'clock']"
          size="2x"
        />
        <font-awesome-icon
          v-else-if="order.status == OrderStatus.IN_PRODUCTION"
          :icon="['fas', 'wrench']"
          size="2x"
        />
        <font-awesome-icon
          v-else-if="order.status == OrderStatus.FINISHED"
          :icon="['far', 'check-circle']"
          size="2x"
        />
      </div>
    </div>
  </b-card>
</template>

<script>
import { OrderStatus } from "../../constants/constants";
import { mapGetters } from "vuex";

/**
 * This component represents a single order. All information about the order such as id, creation date and status will be displayed within a card.
 *
 * @category Orders
 * 
 * @vue-data {Object} OrderStatus - Enum containing every possible order status
 * 
 * @vue-computed {string} selectedOrder - ID of the currently selected order
 * @vue-computed {string} orderId - Formatted ID of this order
 * @vue-computed {string} orderName - Name of this order
 * @vue-computed {Date} createdDate - The creation date of this order
 * @vue-computed {Date} updateDate - The date with the last update of this order
 * @vue-computed {string} statusDescription - Description of the current production-status
 * @vue-computed {number} numberOfParts - The number of cylinders used within this order
 * @vue-computed {string} status - The current status of this order, which matches one of the values in the {@link OrderStatus} enum
 * @vue-computed {string} isSelected - Indicating if this order is currently selected in the {@link OrderList}
 */
export default {
  name: "Order",
  data() {
    return {
      OrderStatus: OrderStatus,
    };
  },
  props: ["order"],
  computed: {
    ...mapGetters(["selectedOrder"]),
    orderId: function() {
      return "ID: " + this.order._id;
    },
    orderName: function() {
      return this.order.orderName;
    },
    createdDate: function() {
      return new Date(Number(this.order.createdAt)).toLocaleString([], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    updatedDate: function() {
      return new Date(Number(this.order.updatedAt)).toLocaleString([], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    statusDescription: function() {
      var status = this.order.status;
      switch (status) {
        case OrderStatus.PENDING:
          return "Ausstehend";
        case OrderStatus.IN_PRODUCTION:
          return "In Produktion";
        case OrderStatus.FINISHED:
          return "Fertiggestellt";
        default:
          return status;
      }
    },
    numberOfParts: function() {
      return this.order.leftStack.length + this.order.rightStack.length;
    },
    status: function() {
      return this.order.status;
    },
    isSelected: function() {
      return this.order == this.selectedOrder;
    },
  },
  methods: {
    /**
     * Marks the current order, if it was not selected. Otherwise unselects the current order.
     */
    toggleSelection() {
      if (this.order == this.selectedOrder) {
        this.$store.commit("setSelectedOrder", null);
      } else {
        this.$store.commit("setSelectedOrder", this.order);
      }
    },
  },
};
</script>

<style>
.card {
  cursor: pointer;
}

.cardHighlight {
  outline-color: rgb(0, 123, 255);
  outline-style: solid;
  outline-width: medium;
}
</style>
