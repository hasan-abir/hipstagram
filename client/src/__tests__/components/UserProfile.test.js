import UserProfile from "@/components/UserProfile.vue";
import vuetify from "@/plugins/vuetify";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

describe("UserProfile", () => {
  it("renders correctly", async () => {
    // when
    const user = {
      avatar: {
        fileId: "cat",
        url: "https://s36537.pcdn.co/wp-content/uploads/2018/01/An-orange-tabby-cat-with-the-M-marking-on-the-forehead.jpg.optimal.jpg",
      },
      username: "Hasan",
      email: "Hasan Abir",
    };

    const wrapper = mount(UserProfile, {
      global: {
        plugins: [vuetify],
        stubs: {
          ImageGrid: true,
        },
      },
      props: {
        user,
      },
    });

    // then
    const images = await wrapper
      .findAll("img")
      .filter(
        (el) => el.attributes("src") === user.avatar.url + "?tr=ar-1-1,w-60"
      );

    expect(wrapper.text()).toContain(user.username);
    expect(images.length).toBeGreaterThan(0);
  });
});
