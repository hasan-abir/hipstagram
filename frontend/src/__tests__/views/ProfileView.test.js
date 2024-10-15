import ProfileView from "@/views/ProfileView.vue";
import UserProfile from "@/components/UserProfile.vue";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { store } from "@/store";

describe("ProfileView", () => {
  beforeAll(() => {
    store.auth.user = { username: "Hasan Abir" };
  });
  afterAll(() => {
    store.auth.user = null;
  });

  it("renders correctly", async () => {
    // when
    const wrapper = mount(ProfileView, {
      global: {
        plugins: [vuetify],
        stubs: {
          UserProfile: true,
        },
      },
    });

    // then
    expect(wrapper.findComponent(UserProfile).isVisible()).toBe(true);
  });
});
