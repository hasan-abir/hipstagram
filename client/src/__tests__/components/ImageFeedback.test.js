import ImageFeedback from "@/components/ImageFeedback.vue";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import demoImages from "../demoImages.json";

describe("ImageFeedback", () => {
  it("renders correctly", async () => {
    // when
    const image = { ...demoImages.images[0] };
    image.author = {
      username: "Hasan Abir",
      avatar: {
        file: "file",
        url: "url",
      },
    };
    image.caption = "Lorem";
    const wrapper = mount(ImageFeedback, {
      global: {
        plugins: [vuetify, router],
        stubs: {
          ImageComment: true,
          ImageLike: true,
        },
      },
      props: {
        image,
      },
    });

    // then
    expect(wrapper.text()).toContain(image.author.username);
    expect(wrapper.text()).toContain(image.caption);
  });
});
