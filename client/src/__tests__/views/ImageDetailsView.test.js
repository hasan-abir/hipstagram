import imageController from "@/controllers/imageController";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import ImageDetailsView from "@/views/ImageDetailsView.vue";
import { DOMWrapper, mount } from "@vue/test-utils";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import demoImages from "../demoImages.json";

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
    const returnValue = { ...demoImages.images[0] };
    returnValue.author = {
      username: "Hasan Abir",
      avatar: {
        file: "file",
        url: "url",
      },
    };
    imageController.getSingleImage.mockResolvedValue(returnValue);

    router.push("/image/" + imageId);

    await router.isReady();

    // when
    // Wrapper to find overlay'd elements
    const domWrapper = new DOMWrapper(document.body);
    mount(ImageDetailsView, {
      global: {
        plugins: [vuetify, router],
        stubs: {
          ImageFeedback: true,
        },
      },
    });

    // Wait to update the DOM
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    // then
    expect(domWrapper.findAll("img").at(0).attributes("src")).toBe(
      demoImages.images[0].file.url + "?tr=w-800"
    );
    expect(imageController.getSingleImage).toBeCalledTimes(1);
    expect(imageController.getSingleImage).toBeCalledWith(imageId);
  });
});
