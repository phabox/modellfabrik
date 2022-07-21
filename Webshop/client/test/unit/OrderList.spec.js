import { shallowMount, mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import OrderList from "../../src/components/orders/OrderList.vue";
import Order from "../../src/components/orders/Order.vue";

describe("OrderList not empty", () => {
  let getters;
  let store;
  let localVue = createLocalVue();
  localVue.use(Vuex);

  getters = {
    selectedOrder: () => {},
    orders: () => [
      {
        _id: "5f8fdebe83ca6905e0718342",
        orderName: "",
        leftStack: [
          {
            position: 0,
            height: 18,
            color: { r: 0.85, g: 0.85, b: 0.85, name: "silber" },
          },
        ],
        rightStack: [],
        status: "FINISHED",
        createdAt: "1577836800",
        updatedAt: "1577836900",
        __v: 0,
      },
      {
        _id: "5f8fe27283ca6905e071834d",
        orderName: "Testname",
        leftStack: [
          {
            position: 0,
            height: 18,
            color: { r: 0.85, g: 0.85, b: 0.85, name: "silber" },
          },
        ],
        rightStack: [
          {
            position: 0,
            height: 22,
            color: { r: 0.85, g: 0.85, b: 0.85, name: "silber" },
          },
        ],
        status: "FINISHED",
        createdAt: "1580601600",
        updatedAt: "1580601700",
        __v: 0,
      },
    ],
  };

  store = new Vuex.Store({
    getters,
  });

  it("Order components exist with no empty store", () => {
    const wrapper = mount(OrderList, { store, localVue });
    expect(wrapper.findComponent(Order).exists()).toBe(true);
  });

  it("Order components shows the correct number of rows", () => {
    const wrapper = mount(OrderList, { store, localVue });
    expect(wrapper.findAllComponents(Order).length).toBe(2);
  });
});
