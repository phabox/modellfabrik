import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    settings: null,
    orders: [],
    stock: null,

    leftCylinders: [],
    rightCylinders: [],
    selectedOrder: null,

    fetchSettingsError: null,
    fetchOrdersError: null,
  },
  mutations: {
    setSettings(state, settings) {
      state.settings = settings;
    },

    setOrders(state, orders) {
      state.orders = orders;
    },

    setStock(state, stock) {
      state.stock = stock;
    },

    addOrder(state, order) {
      state.orders.unshift(order);
    },

    updateOrder(state, order) {
      var index = state.orders.findIndex((x) => x._id === order._id);
      if (index != -1) {
        //Restore row selection
        if (state.orders[index] == state.selectedOrder) {
          state.selectedOrder = order;
        }
        state.orders.splice(index, 1, order);
      } else {
        console.error(
          "updateOrder: cant find element with id " + order._id + " in existing orders"
        );
      }
    },

    updateLeftCylinders(state, leftCylinders) {
      state.leftCylinders = [];
      state.leftCylinders = leftCylinders;
    },
    updateRightCylinders(state, rightCylinders) {
      state.rightCylinders = [];
      state.rightCylinders = rightCylinders;
    },

    setSelectedOrder(state, selectedOrder) {
      state.selectedOrder = selectedOrder;
    },
    setFetchSettingsError(state, error) {
      state.fetchSettingsError = error;
    },
    setFetchOrdersError(state, error) {
      state.fetchOrdersError = error;
    },
  },
  getters: {
    settings: (state) => state.settings,
    orders: (state) => state.orders,
    stock: (state) => state.stock,
    allCylinders: (state) => state.leftCylinders.concat(state.rightCylinders),
    leftCylinders: (state) => state.leftCylinders,
    rightCylinders: (state) => state.rightCylinders,
    selectedOrder: (state) => state.selectedOrder,
    fetchSettingsError: (state) => state.fetchSettingsError,
    fetchOrdersError: (state) => state.fetchOrdersError,
  },
  actions: {},
  modules: {},
});
