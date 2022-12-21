import ImageCard from "@/components/ImageCard.vue";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import demoImages from "../demoImages.json";

describe("ImageCard", () => {
  it("renders correctly", async () => {
    // when

    const wrapper = mount(ImageCard, {
      global: {
        plugins: [vuetify, router],
      },
      props: {
        image: demoImages.images[0],
      },
    });

    // then
    expect(wrapper.findAll("img").length).toBe(2);
  });
});
