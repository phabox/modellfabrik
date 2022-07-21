import { mount, shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import ConfigurationSummary from "../../src/components/configurator/ConfigurationSummary.vue";

describe("ConfigurationSummary not empty", () => {
  let getters;
  let store;
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);

    getters = {
      settings: () => {
        return {
          cylinders: [
            {
              height: 15,
              colors: [
                {
                  r: 0.85,
                  g: 0.85,
                  b: 0.85,
                  name: "silber",
                },
                {
                  r: 0.1,
                  g: 0.1,
                  b: 0.85,
                  name: "blau",
                },
              ],
            },
            {
              height: 18,
              colors: [
                {
                  r: 0.85,
                  g: 0.85,
                  b: 0.85,
                  name: "silber",
                },
                {
                  r: 0.1,
                  g: 0.1,
                  b: 0.85,
                  name: "blau",
                },
              ],
            },
            {
              height: 22,
              colors: [
                {
                  r: 0.85,
                  g: 0.85,
                  b: 0.85,
                  name: "silber",
                },
                {
                  r: 0.1,
                  g: 0.1,
                  b: 0.85,
                  name: "blau",
                },
              ],
            },
          ],
          maxHeight: 100,
          maxCylinders: 5,
        };
      },

      leftCylinders: () => [
        { height: 15, color: "blau" },
        { height: 15, color: "blau" },
        { height: 18, color: "silber" },
      ],
      rightCylinders: () => [
        { height: 15, color: "blau" },
        { height: 15, color: "blau" },
        { height: 18, color: "silber" },
      ],
      allCylinders: () => [
        { height: 15, color: "blau" },
        { height: 15, color: "blau" },
        { height: 18, color: "silber" },
        { height: 15, color: "blau" },
        { height: 15, color: "blau" },
        { height: 18, color: "silber" },
      ],
      stock: () => {
        return {
          immediateStock: [
            {
              height: 15,
              color: "silber",
              available: 1,
            },
            {
              height: 15,
              color: "blau",
              available: 1,
            },
            {
              height: 18,
              color: "silber",
              available: 1,
            },
            {
              height: 18,
              color: "blau",
              available: 1,
            },
            {
              height: 22,
              color: "silber",
              available: 1,
            },
            {
              height: 22,
              color: "blau",
              available: 1,
            },
          ],
          intermediateStock: [
            {
              height: 15,
              color: "silber",
              available: 1,
            },
            {
              height: 15,
              color: "blau",
              available: 1,
            },
            {
              height: 18,
              color: "silber",
              available: 1,
            },
            {
              height: 18,
              color: "blau",
              available: 1,
            },
            {
              height: 22,
              color: "silber",
              available: 1,
            },
            {
              height: 22,
              color: "blau",
              available: 1,
            },
          ],
        };
      },
    };

    store = new Vuex.Store({
      getters,
    });
  });

  it("Shows table rows", () => {
    const wrapper = mount(ConfigurationSummary, { store, localVue });
    expect(wrapper.find("tr").exists()).toBe(true);
  });

  it("Shows correct number of table rows", () => {
    const wrapper = mount(ConfigurationSummary, { store, localVue });
    expect(wrapper.findAll("tbody > tr").length).toBe(2);
  });
});

describe("ConfigurationSummary empty", () => {
  let getters;
  let store;
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);

    getters = {
      settings: () => {
        return {
          cylinders: [
            {
              height: 15,
              colors: [
                {
                  r: 0.85,
                  g: 0.85,
                  b: 0.85,
                  name: "silber",
                },
                {
                  r: 0.1,
                  g: 0.1,
                  b: 0.85,
                  name: "blau",
                },
              ],
            },
            {
              height: 18,
              colors: [
                {
                  r: 0.85,
                  g: 0.85,
                  b: 0.85,
                  name: "silber",
                },
                {
                  r: 0.1,
                  g: 0.1,
                  b: 0.85,
                  name: "blau",
                },
              ],
            },
            {
              height: 22,
              colors: [
                {
                  r: 0.85,
                  g: 0.85,
                  b: 0.85,
                  name: "silber",
                },
                {
                  r: 0.1,
                  g: 0.1,
                  b: 0.85,
                  name: "blau",
                },
              ],
            },
          ],
          maxHeight: 100,
          maxCylinders: 5,
        };
      },

      leftCylinders: () => [],
      rightCylinders: () => [],
      allCylinders: () => [],
      stock: () => {
        return {
          immediateStock: [
            {
              height: 15,
              color: "silber",
              available: 1,
            },
            {
              height: 15,
              color: "blau",
              available: 1,
            },
            {
              height: 18,
              color: "silber",
              available: 1,
            },
            {
              height: 18,
              color: "blau",
              available: 1,
            },
            {
              height: 22,
              color: "silber",
              available: 1,
            },
            {
              height: 22,
              color: "blau",
              available: 1,
            },
          ],
          intermediateStock: [
            {
              height: 15,
              color: "silber",
              available: 1,
            },
            {
              height: 15,
              color: "blau",
              available: 1,
            },
            {
              height: 18,
              color: "silber",
              available: 1,
            },
            {
              height: 18,
              color: "blau",
              available: 1,
            },
            {
              height: 22,
              color: "silber",
              available: 1,
            },
            {
              height: 22,
              color: "blau",
              available: 1,
            },
          ],
        };
      },
    };

    store = new Vuex.Store({
      getters,
    });
  });

  it("Shows table header", () => {
    const wrapper = mount(ConfigurationSummary, { store, localVue });
    expect(wrapper.find("tr").exists()).toBe(true);
  });

  it("Does show only one row", () => {
    const wrapper = mount(ConfigurationSummary, { store, localVue });
    expect(wrapper.findAll("tr").length).toBe(1);
  });

  it("Does not show any cylinder rows", () => {
    const wrapper = mount(ConfigurationSummary, { store, localVue });
    expect(wrapper.findAll("tbody > tr").exists()).toBe(false);
  });
});
