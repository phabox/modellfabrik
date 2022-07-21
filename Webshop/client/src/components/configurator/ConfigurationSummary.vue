<template>
  <div>
    <br />
    <h3 class="text-center">Material</h3>
    <br />
    <b-table :items="items" :fields="columns">
      <template #cell(status)="{ value }">
        <status-indicator :status="value" pulse />
      </template>
    </b-table>
    <br />
    <div v-if="allCylinders.length > 0">
      <b-form-input
        v-model="orderName"
        maxlength="64"
        placeholder="Name der Bestellung (optional)"
      ></b-form-input>
      <div class="mt-3 text-center">
        <button class="btn btn-success" @click="buyWithLoading">
          Bestellen
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { PRODUCE_ITEM } from "../../constants/graphql";
import { EventBus } from "../../main";

/**
 * 
 * The component shows a summary of the configured product. It shows a list of cylinders, the selected colors and heights and the
 * order status
 *
 * @category Configurator
 * 
 * @vue-data {Object[]} columns - The table column properties
 * @vue-computed {number[]} filledHeights - All cylinder-heights, that are part of the current configuration
 * @vue-computed {Set.<Object>} items - The cylinders grouped by height and color, that are displayed in the table
 * @vue-computed {Object} settings - The cylinder property settings including available heights and colors
 * @vue-computed {Object[]} leftCylinders - The cylinders objects on the left (A) stack
 * @vue-computed {Object[]} rightCylinders - The cylinders objects on the right (B) stack
 * @vue-computed {Object[]} allCylinders - The union of leftCylinders and rightCylinders
 * @vue-event {} onSuccessfulOrder - Emit notification, that an order was successfully transmitted
 */

export default {
  name: "ConfigurationSummary",
  data() {
    return {
      columns: [
        { key: "height", label: "Größe [mm]", class: "text-center" },
        { key: "color", label: "Farbe", class: "text-center" },
        { key: "amount", label: "Anzahl", class: "text-center" },
        { key: "status", label: "Lieferstatus", class: "text-center" },
      ],
      orderName: "",
    };
  },
  methods: {
    /**
     * Calls the {@link buy} method and adds a loading dialog
     */
    buyWithLoading() {
      this.$swal({
        title: "Bestellung wird übertragen",
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          this.$swal.showLoading();
        },
      });
      setTimeout(() => {
        this.buy();
      }, 1500);
    },

    /**
     * Transmits the product configuration to the backend server. The result is shown in the dialog
     */
    buy() {
      const result = this.$apollo
        .mutate({
          mutation: PRODUCE_ITEM,
          variables: {
            order: {
              orderName: this.orderName,
              leftStack: this.mapCylinderInput(this.leftCylinders),
              rightStack: this.mapCylinderInput(this.rightCylinders),
            },
          },
        })
        .then((result) => {
          if (result.data.produce.code == 0) {
            this.$swal({
              title: "Erfolg",
              text: result.data.produce.msg,
              icon: "success",
            }).then(function() {
              EventBus.$emit("onSuccessfulOrder");
            });
          } else {
            this.$swal("Fehler", result.data.produce.msg, "error");
          }
        })
        .catch((error) => {
          this.$swal("Fehler", String(error), "error");
        });
    },

    /**
     * Prepares the cylinder configuration to be passed to the backend server
     * @param {Object[]} cylinderStack - The stack of cylinders to be converted to a valid GraphQL input
     *
     * @returns {Object[]} - Array of mapped cylinder objects, which can be used for the GraphQL order mutation
     */
    mapCylinderInput(cylinderStack) {
      var i = 0;
      return cylinderStack.map((cylinder) => ({
        color: {
          r: cylinder.color.r,
          g: cylinder.color.g,
          b: cylinder.color.b,
          name: cylinder.color.name,
        },
        height: cylinder.height,
        position: i++,
      }));
    },

    /**
     * Counts the number of cylinders with a given height in the current configuration
     *
     * @param {Object[]} cylinders - The cylinders to be counted
     * @param {number} height - The height to be matched
     *
     * @return {number} - The number of cylinders with the given {@link height}
     */
    countHeight(cylinders, height) {
      return cylinders.filter((c) => c.height == height).length;
    },

    /**
     * Counts the number of cylinders with a given height and color
     *
     * @param {Object[]} cylinders - The cylinders to be counted
     * @param {number} height - The height to be matched
     * @param {string} colorName - The color to be matched
     *
     * @return {number} - Number of cylinders matching {@link height} and {@link colorName}
     */
    countColorByHeight(cylinders, height, colorName) {
      var result = cylinders.filter(
        (c) => c.height == height && c.color.name == colorName
      ).length;
      return result;
    },

    /**
     * Calculates all used colors in the current configuration of cylinders with a given height
     *
     * @param {number} height - The height of the cylinders to be matched
     *
     * @returns {Set.<string>} - Distinct set of color names used in the current product configuration
     */
    filledColors: function(height) {
      return new Set(
        this.allCylinders
          .filter((cylinder) => cylinder.height == height)
          .map((cylinder) => cylinder.color.name)
      );
    },

    /**
     * Gets the stock-availability of a cylinder based on {@link height}, {@link color} and {@link amount}
     *
     * @param {number} height - The height to be matched
     * @param {string} color - The color to be matched
     * @param {number} amount - The number of cylinders needed
     *
     * @returns {string} - A string indicating the stock availability for the amount of cylinders matching height and color
     */
    getAvailability(height, color, amount) {
      if (this.getImmediateAvailable(height, color) >= amount) {
        return "positive";
      }
      if (
        this.getImmediateAvailable(height, color) +
          this.getIntermediateStockAvailable(height, color) >=
        amount
      ) {
        return "intermediary";
      }
      return "negative";
    },

    /**
     * Gets the availablity of cylinders in the immediate stock
     *
     * @param {height} height - Height of the cylinders to be matched
     * @param {string} color - Name of the color to be matched
     *
     * @returns Number of cylinders in the immediate stock matching {@link height} and {@link color}
     */
    getImmediateAvailable(height, color) {
      for (var i = 0; i < this.stock.immediateStock.length; i++) {
        var stockItem = this.stock.immediateStock[i];
        if (stockItem.height == height && stockItem.color == color) {
          return stockItem.available;
        }
      }
      return 0;
    },

    /**
     * Gets the availablity of cylinders in the intermediate stock
     *
     * @param {height} height - Height of the cylinders to be matched
     * @param {string} color - Name of the color to be matched
     *
     * @returns Number of cylinders in the intermediate stock matching {@link height} and {@link color}
     */
    getIntermediateStockAvailable(height, color) {
      for (var i = 0; i < this.stock.intermediateStock.length; i++) {
        var stockItem = this.stock.intermediateStock[i];
        if (stockItem.height == height && stockItem.color == color) {
          return stockItem.available;
        }
      }
      return 0;
    },
  },

  computed: {
    ...mapGetters([
      "settings",
      "leftCylinders",
      "rightCylinders",
      "allCylinders",
      "stock",
    ]),

    filledHeights: function() {
      return new Set(
        this.settings.cylinders
          .filter(
            (cylinder) =>
              this.countHeight(this.allCylinders, cylinder.height) > 0
          )
          .map((cylinder) => cylinder.height)
      );
    },

    items: function() {
      var result = [];
      for (var height of this.filledHeights) {
        for (var color of this.filledColors(height)) {
          var amount = this.countColorByHeight(
            this.allCylinders,
            height,
            color
          );
          result.push({
            height: height,
            color: color,
            amount: amount,
            status: this.getAvailability(height, color, amount),
          });
        }
      }
      return result;
    },
  },
};
</script>
