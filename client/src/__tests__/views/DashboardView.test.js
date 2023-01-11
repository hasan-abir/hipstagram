import DashboardView from "@/views/DashboardView.vue";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { store } from "@/store";

describe("DashboardView", () => {
  beforeAll(() => {
    store.auth.user = { username: "Hasan Abir" };
  });
  afterAll(() => {
    store.auth.user = null;
  });

  it("renders correctly", async () => {
    // when
    const wrapper = mount(DashboardView, {
      global: {
        plugins: [vuetify, router],
        stubs: {
          ImageGrid: true,
        },
      },
    });

    // then
    expect(wrapper.text()).toContain("Welcome, " + store.auth.user.username);
  });
});
