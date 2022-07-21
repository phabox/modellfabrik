import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Order from "../../src/components/orders/Order.vue";

describe("OrderList not empty", () => {
  let getters;
  let store;
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();
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
  });

  it("Order component exists", () => {
    const wrapper = mount(Order, {
      store,
      localVue,
      propsData: {
        order: {
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
      },
    });
    expect(wrapper.findComponent(Order).exists()).toBe(true);

  });

  it("Order component shows correct data", () => {
    const wrapper = mount(Order, {
      store,
      localVue,
      propsData: {
        order: {
          _id: "5f8fdebe83ca6905e0718342",
          orderName: "Testname",
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
      },
    });
    expect(wrapper.findComponent(Order).exists()).toBe(true);
    expect(wrapper.find(".created").exists()).toBe(true);
    expect(wrapper.find(".updated").exists()).toBe(true);
    expect(wrapper.find(".orderName").exists()).toBe(true);
    expect(wrapper.find(".orderName").text()).toBe("Testname");

  });

  it("Order name is not shown if it does not exist", () => {
    const wrapper = mount(Order, {
      store,
      localVue,
      propsData: {
        order: {
          _id: "5f8fdebe83ca6905e0718342",
          orderName: null,
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
      },
    });
    expect(wrapper.find(".orderName").exists()).toBe(false);

  });
});
