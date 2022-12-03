import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { store } from "@/store";
import RegisterView from "@/views/RegisterView.vue";
import { mount } from "@vue/test-utils";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { RouterLink } from "vue-router";

describe("RegisterView", () => {
  beforeAll(() => {
    vi.mock("@/store");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly", () => {
    // when
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [vuetify, router],
      },
    });

    // then
    expect(wrapper.text()).toContain("Create an account");
  });
  it("should display error when submitted without input", async () => {
    // when
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [vuetify, router],
      },
      // For form submissions
      attachTo: document.body,
    });

    // then
    const button = wrapper.find("button");

    await button.trigger("click");

    expect(store.register).toBeCalledTimes(0);

    // For form submissions
    wrapper.unmount();
  });
  it("should display error when submitted with invalid input", async () => {
    // when
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [vuetify, router],
      },
      // For form submissions
      attachTo: document.body,
    });

    // then
    const button = wrapper.find("button");

    await button.trigger("click");

    const usernameInput = wrapper.findAll("[type='text']").at(0);
    const emailInput = wrapper.findAll("[type='text']").at(1);
    const passwordInput = wrapper.find("[type='password']");

    // One tick per rule
    await usernameInput.setValue("Hasan");
    await emailInput.setValue("hasanabirtest.com");
    await nextTick();
    await passwordInput.setValue("testte");
    await nextTick();

    expect(store.register).toBeCalledTimes(0);

    // For form submissions
    wrapper.unmount();
  });
  it("should display error msg from backend", async () => {
    // given
    const errMsg = "Error from backend";
    store.register.mockImplementation(() => {
      const err = new Error();
      err.response = { data: { msg: errMsg }, statusCode: 500 };

      throw err;
    });

    // when
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [vuetify, router],
      },
      // For form submissions
      attachTo: document.body,
    });

    // then
    const button = wrapper.find("button");

    const usernameInput = wrapper.findAll("[type='text']").at(0);
    const emailInput = wrapper.findAll("[type='text']").at(1);
    const passwordInput = wrapper.find("[type='password']");

    // One tick per rule
    await usernameInput.setValue("Hasan");
    await emailInput.setValue("hasanabir@test.com");
    await nextTick();
    await passwordInput.setValue("testtest");
    await nextTick();

    await button.trigger("click");

    expect(store.register).toBeCalledTimes(1);
    expect(wrapper.text()).toContain(errMsg);

    wrapper.unmount();
  });
  it("should display multiple error msg from backend", async () => {
    // given
    const errMsgs = {
      errorOne: "ErrorOne",
      errorTwo: "ErrorTwo",
      errorThree: "ErrorThree",
    };

    store.register.mockImplementation(() => {
      const err = new Error();
      err.response = { data: errMsgs, statusCode: 400 };

      throw err;
    });

    // when
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [vuetify, router],
      },
      // For form submissions
      attachTo: document.body,
    });

    // then
    const button = wrapper.find("button");

    const usernameInput = wrapper.findAll("[type='text']").at(0);
    const emailInput = wrapper.findAll("[type='text']").at(1);
    const passwordInput = wrapper.find("[type='password']");

    // One tick per rule
    await usernameInput.setValue("Hasan");
    await emailInput.setValue("hasanabir@test.com");
    await nextTick();
    await passwordInput.setValue("testtest");
    await nextTick();

    await button.trigger("click");

    expect(store.register).toBeCalledTimes(1);
    expect(wrapper.text()).toContain(errMsgs.errorOne);
    expect(wrapper.text()).toContain(errMsgs.errorTwo);
    expect(wrapper.text()).toContain(errMsgs.errorThree);

    wrapper.unmount();
  });
  it("should have link to login", async () => {
    // when
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [vuetify, router],
      },
    });

    // then
    expect(wrapper.findComponent(RouterLink).props("to")).toBe("/login");
  });
  it("should submit form and call register", async () => {
    // when
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [vuetify, router],
      },
      // For form submissions
      attachTo: document.body,
    });

    // then
    const button = wrapper.find("button");

    const usernameInput = wrapper.findAll("[type='text']").at(0);
    const emailInput = wrapper.findAll("[type='text']").at(1);
    const passwordInput = wrapper.find("[type='password']");

    // One tick per rule
    await usernameInput.setValue("Hasan");
    await emailInput.setValue("hasanabir@test.com");
    await nextTick();
    await passwordInput.setValue("testtest");
    await nextTick();

    await button.trigger("click");

    expect(store.register).toBeCalledTimes(1);

    wrapper.unmount();
  });
});
