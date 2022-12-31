import ImageCard from "@/components/ImageCard.vue";
import vuetify from "@/plugins/vuetify";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import demoImages from "../demoImages.json";

describe("ImageCard", () => {
  it("renders correctly", async () => {
    // when
    const wrapper = mount(ImageCard, {
      global: {
        plugins: [vuetify],
      },
      props: {
        image: demoImages.images[0],
      },
    });

    // then
    const highResImg = wrapper
      .findAll("img")
      .filter(
        (el) =>
          el.attributes("src") ===
          demoImages.images[0].file.url + "?tr=ar-1-1,w-400"
      )[0];
    expect(highResImg).toBeDefined();
    expect(highResImg.attributes("alt")).toBe(demoImages.images[0].caption);
  });
});
