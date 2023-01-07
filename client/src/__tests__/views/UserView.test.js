import UserView from "@/views/UserView.vue";
import UserProfile from "@/components/UserProfile.vue";
import authController from "@/controllers/authController";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

describe("UserView", () => {
  beforeAll(() => {
    vi.mock("@/controllers/authController");
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", async () => {
    // given
    const user = { username: "Hasan Abir" };
    authController.getUserByUsername.mockResolvedValue(user);

    router.push("/user/" + user.username);

    await router.isReady();

    // when
    const wrapper = mount(UserView, {
      global: {
        plugins: [vuetify, router],
        stubs: {
          UserProfile: true,
        },
      },
    });

    // Wait to update the DOM
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    // then
    expect(authController.getUserByUsername).toBeCalledTimes(1);
    expect(authController.getUserByUsername).toBeCalledWith(user.username);
    expect(wrapper.findComponent(UserProfile).isVisible()).toBe(true);
  });
  it("error from backend is visible", async () => {
    // given
    const user = { username: "Hasan Abir" };
    const msg = "Error from backend";
    authController.getUserByUsername.mockImplementation(() => {
      const err = new Error();
      err.response = { data: { msg }, status: 500 };

      throw err;
    });

    router.push("/user/" + user.username);

    await router.isReady();

    // when
    const wrapper = mount(UserView, {
      global: {
        plugins: [vuetify, router],
        stubs: {
          UserProfile: true,
        },
      },
    });

    // Wait to update the DOM
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    // then
    expect(authController.getUserByUsername).toBeCalledTimes(1);
    expect(authController.getUserByUsername).toBeCalledWith(user.username);
    expect(wrapper.text()).toContain(msg);
  });
});
