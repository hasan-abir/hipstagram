import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { store } from "@/store";
import LoginView from "@/views/LoginView.vue";
import { mount } from "@vue/test-utils";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { RouterLink } from "vue-router";

describe("LoginView", () => {
  beforeAll(() => {
    vi.mock("@/store");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly", () => {
    // when
    const wrapper = mount(LoginView, {
      global: {
        plugins: [vuetify, router],
      },
    });

    // then
    expect(wrapper.text()).toContain("Login");
  });
  it("should display error when submitted without input", async () => {
    // when
    const wrapper = mount(LoginView, {
      global: {
        plugins: [vuetify, router],
      },
      // For form submissions
      attachTo: document.body,
    });

    // then
    const button = wrapper.find("button");

    await button.trigger("click");

    expect(store.login).toBeCalledTimes(0);

    // For form submissions
    wrapper.unmount();
  });
  it("should display error when submitted with invalid input", async () => {
    // when
    const wrapper = mount(LoginView, {
      global: {
        plugins: [vuetify, router],
      },
      // For form submissions
      attachTo: document.body,
    });

    // then
    const button = wrapper.find("button");

    await button.trigger("click");

    const emailInput = wrapper.find("[type='text']");
    const passwordInput = wrapper.find("[type='password']");

    // One tick per rule
    await emailInput.setValue("hasanabirtest.com");
    await nextTick();
    await passwordInput.setValue("testte");
    await nextTick();

    expect(store.login).toBeCalledTimes(0);

    // For form submissions
    wrapper.unmount();
  });
  it("should display error msg from backend", async () => {
    // given
    const errMsg = "Error from backend";
    store.login.mockImplementation(() => {
      const err = new Error();
      err.response = { data: { msg: errMsg }, status: 500 };

      throw err;
    });

    // when
    const wrapper = mount(LoginView, {
      global: {
        plugins: [vuetify, router],
      },
      // For form submissions
      attachTo: document.body,
    });

    // then
    const button = wrapper.find("button");

    const emailInput = wrapper.find("[type='text']");
    const passwordInput = wrapper.find("[type='password']");

    // One tick per rule
    await emailInput.setValue("hasanabir@test.com");
    await nextTick();
    await passwordInput.setValue("testtest");
    await nextTick();

    await button.trigger("click");

    expect(store.login).toBeCalledTimes(1);
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

    store.login.mockImplementation(() => {
      const err = new Error();
      err.response = { data: errMsgs, status: 400 };

      throw err;
    });

    // when
    const wrapper = mount(LoginView, {
      global: {
        plugins: [vuetify, router],
      },
      // For form submissions
      attachTo: document.body,
    });

    // then
    const button = wrapper.find("button");

    const emailInput = wrapper.find("[type='text']");
    const passwordInput = wrapper.find("[type='password']");

    // One tick per rule
    await emailInput.setValue("hasanabir@test.com");
    await nextTick();
    await passwordInput.setValue("testtest");
    await nextTick();

    await button.trigger("click");

    expect(store.login).toBeCalledTimes(1);
    expect(wrapper.text()).toContain(errMsgs.errorOne);
    expect(wrapper.text()).toContain(errMsgs.errorTwo);
    expect(wrapper.text()).toContain(errMsgs.errorThree);

    wrapper.unmount();
  });
  it("should have link to register", async () => {
    // when
    const wrapper = mount(LoginView, {
      global: {
        plugins: [vuetify, router],
      },
    });

    // then
    expect(wrapper.findComponent(RouterLink).props("to")).toBe("/register");
  });
  it("should submit form and call login", async () => {
    // when
    const wrapper = mount(LoginView, {
      global: {
        plugins: [vuetify, router],
      },
      // For form submissions
      attachTo: document.body,
    });

    // then
    const button = wrapper.find("button");

    const emailInput = wrapper.find("[type='text']");
    const passwordInput = wrapper.find("[type='password']");

    // One tick per rule
    await emailInput.setValue("hasanabir@test.com");
    await nextTick();
    await passwordInput.setValue("testtest");
    await nextTick();

    await button.trigger("click");

    expect(store.login).toBeCalledTimes(1);

    wrapper.unmount();
  });
});
