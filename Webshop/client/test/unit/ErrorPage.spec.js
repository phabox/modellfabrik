import { mount } from "@vue/test-utils";
import Error from "../../src/components/shared/Error.vue";

describe("ErrorPage", () => {
  const wrapper = mount(Error, {
    propsData: {
      errorMessage: "foo",
    },
  });
  it("contains error message", () => {
    expect(wrapper.props().errorMessage).toBe("foo");
  });
  it("error message exists", () => {
    expect(wrapper.find(".error").exists()).toBe(true);
  });
  it("displays correct error message", () => {
    expect(wrapper.find(".error").text()).toBe("foo");
  });
});
