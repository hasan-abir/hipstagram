import HomeView from "@/views/HomeView.vue";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

describe("HomeView", () => {
  it("renders correctly", async () => {
    // when
    const wrapper = mount(HomeView, {
      global: {
        plugins: [vuetify, router],
      },
    });

    // then
    expect(wrapper.text()).toContain(
      "Here are the latest pictures uploaded by users!"
    );
  });
});
