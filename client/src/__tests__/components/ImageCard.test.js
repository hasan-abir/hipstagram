import ImageCard from "@/components/ImageCard.vue";
import vuetify from "@/plugins/vuetify";
import { mount } from "@vue/test-utils";
import { afterAll, describe, expect, it } from "vitest";
import demoImages from "../demoImages.json";
import imageController from "@/controllers/imageController";
import { store } from "@/store";

describe("ImageCard", () => {
  beforeAll(() => {
    vi.mock("@/controllers/imageController");
    store.auth.token = "123";
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  afterAll(() => {
    store.auth.token = null;
  });

  it("renders correctly", async () => {
    // when
    const wrapper = mount(ImageCard, {
      global: {
        plugins: [vuetify],
        stubs: {
          ImageEdit: true,
        },
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
  it("clicks delete image", async () => {
    imageController.removeImage.mockResolvedValue(null);
    // when
    const wrapper = mount(ImageCard, {
      global: {
        plugins: [vuetify],
        stubs: {
          ImageEdit: true,
        },
      },
      props: {
        image: demoImages.images[0],
        editable: true,
      },
    });

    const deleteBtn = wrapper
      .findAll("button")
      .filter((el) => el.text() === "Delete")[0];

    await deleteBtn.trigger("click");

    // then
    expect(imageController.removeImage).toBeCalledTimes(1);
    expect(imageController.removeImage).toBeCalledWith(
      store.auth.token,
      demoImages.images[0]._id
    );
  });
});
