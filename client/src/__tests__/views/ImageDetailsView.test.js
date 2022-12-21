import { describe, it, expect, beforeAll, afterEach, vi } from "vitest";
import ImageDetailsView from "@/views/ImageDetailsView.vue";
import demoImages from "../demoImages.json";
import vuetify from "@/plugins/vuetify";
import { mount, DOMWrapper } from "@vue/test-utils";
import imageController from "@/controllers/imageController";
import router from "@/router";
import { nextTick } from "vue";

describe("ImageDetailsView", () => {
  beforeAll(() => {
    vi.mock("@/controllers/imageController");
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it("renders correctly", async () => {
    // given
    const imageId = "123";
    imageController.getSingleImage.mockResolvedValue(demoImages.images[0]);

    router.push("/image/" + imageId);

    await router.isReady();

    // when
    // Wrapper to find overlay'd elements
    const domWrapper = new DOMWrapper(document.body);
    mount(ImageDetailsView, {
      global: {
        plugins: [vuetify, router],
      },
    });

    // Wait to update the DOM
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    // then
    expect(domWrapper.findAll("img").length).toBe(2);
    expect(imageController.getSingleImage).toBeCalledTimes(1);
    expect(imageController.getSingleImage).toBeCalledWith(imageId);
  });
});
