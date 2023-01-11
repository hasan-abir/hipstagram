import {
  describe,
  it,
  expect,
  afterEach,
  vi,
  beforeAll,
  afterAll,
} from "vitest";
import { mount } from "@vue/test-utils";
import DynamicNavbar from "@/components/DynamicNavbar.vue";
import VApp from "vuetify/components/VApp";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { store } from "@/store";

// Nav bars need to be wrapped in v-app
const ComponentWrapper = {
  template: "<v-app><DynamicNavbar /></v-app>",
  components: { VApp, DynamicNavbar },
};

describe("DynamicNavbar", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly", () => {
    // when
    const wrapper = mount(ComponentWrapper, {
      global: {
        plugins: [vuetify, router],
      },
    });

    // then
    expect(wrapper.text()).toContain("Hipstagram");
    const links = wrapper
      .findAll("a")
      .map((el) => el.attributes("href"))
      .join();

    expect(links).toContain("/");
    expect(links).toContain("/login");
    expect(links).toContain("/register");
    expect(links).not.toContain("/dashboard");
    expect(links).not.toContain("/profile");
  });
  describe("Authenticated: ", () => {
    beforeAll(() => {
      store.auth.user = {
        avatar: {
          url: "https://hasanabir.netlify.app/media/avatar.webp",
        },
        username: "Hasan Abir",
      };
    });
    afterAll(() => {
      store.auth.user = null;
    });

    it("should alter links when user is logged in", () => {
      // when
      const wrapper = mount(ComponentWrapper, {
        global: {
          plugins: [vuetify, router],
        },
      });

      // then
      const links = wrapper
        .findAll("a")
        .map((el) => el.attributes("href"))
        .join();

      expect(links).toContain("/");
      expect(links).toContain("/dashboard");
      expect(links).toContain("/profile");
      expect(links).not.toContain("/login");
      expect(links).not.toContain("/register");
      expect(wrapper.find("button").text()).toBe("Logout");
    });
    it("should logout the user", () => {
      // given
      const logoutMock = vi.spyOn(store, "logout");

      // when
      const wrapper = mount(ComponentWrapper, {
        global: {
          plugins: [vuetify, router],
        },
      });

      // then
      const logoutBtn = wrapper
        .findAll("button")
        .filter((el) => el.text().match("Logout"))[0];

      logoutBtn.trigger("click");

      expect(logoutMock).toBeCalledTimes(1);
    });
  });
});
