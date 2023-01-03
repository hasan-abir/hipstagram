import { describe, it, expect, beforeAll, vi, afterEach } from "vitest";
import ImageGrid from "@/components/ImageGrid.vue";
import ImageCard from "@/components/ImageCard.vue";
import imageController from "@/controllers/imageController";
import demoImages from "../demoImages.json";
import vuetify from "@/plugins/vuetify";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import router from "@/router";

describe("ImageGrid", () => {
  beforeAll(() => {
    vi.mock("@/controllers/imageController");
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", async () => {
    // given
    imageController.getLatestImages.mockResolvedValue(demoImages);

    // when
    const wrapper = mount(ImageGrid, {
      global: {
        plugins: [vuetify, router],
        stubs: {
          ImageCard: true,
        },
      },
    });

    // Wait to update the DOM
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    // then
    expect(wrapper.findAllComponents(ImageCard).length).toBe(10);
    expect(imageController.getLatestImages).toHaveBeenCalledTimes(1);
    expect(imageController.getLatestImages).toHaveBeenCalledWith(
      10,
      null,
      undefined
    );
  });
  it("displays error from backend", async () => {
    // given
    const errMsg = "Error from backend";
    const err = new Error();
    err.response = { data: { msg: errMsg }, status: 500 };

    imageController.getLatestImages.mockRejectedValue(err);

    // when
    const wrapper = mount(ImageGrid, {
      global: {
        plugins: [vuetify, router],
        stubs: {
          ImageCard: true,
        },
      },
    });

    // Wait to update the DOM
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    // then
    expect(wrapper.text()).toContain(errMsg);
    expect(wrapper.findAllComponents(ImageCard).length).toBe(0);
    expect(imageController.getLatestImages).toHaveBeenCalledTimes(1);
    expect(imageController.getLatestImages).toHaveBeenCalledWith(
      10,
      null,
      undefined
    );
  });
  it("show more button loads more images", async () => {
    // given
    imageController.getLatestImages.mockResolvedValue(demoImages);

    // when
    const wrapper = mount(ImageGrid, {
      global: {
        plugins: [vuetify, router],
        stubs: {
          ImageCard: true,
        },
      },
    });

    // Wait to update the DOM
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();
    await wrapper
      .findAll("button")
      .filter((el) => el.text() === "Show more")[0]
      .trigger("click");
    // Wait again after click
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    // then
    expect(wrapper.findAllComponents(ImageCard).length).toBe(20);
    expect(imageController.getLatestImages).toHaveBeenCalledTimes(2);
    expect(imageController.getLatestImages).toHaveBeenCalledWith(
      10,
      null,
      undefined
    );
  });
});
