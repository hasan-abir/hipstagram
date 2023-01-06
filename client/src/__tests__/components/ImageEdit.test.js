import ImageEdit from "@/components/ImageEdit.vue";
import vuetify from "@/plugins/vuetify";
import { mount } from "@vue/test-utils";
import { afterAll, describe, expect, it } from "vitest";
import demoImages from "../demoImages.json";
import imageController from "@/controllers/imageController";
import { store } from "@/store";
import { nextTick } from "vue";

describe("ImageEdit", () => {
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
    // given
    const caption = "Lorem";

    // when
    const wrapper = mount(ImageEdit, {
      global: {
        plugins: [vuetify],
      },
      props: {
        imageId: demoImages.images[0]._id,
        caption,
      },
    });

    // then
    expect(wrapper.find("textarea").element.value).toBe(caption);
  });
  it("error from backend is visible", async () => {
    // given
    const msg = "Error from backend";
    imageController.updateImage.mockImplementation(() => {
      const err = new Error();
      err.response = { data: { msg }, status: 500 };

      throw err;
    });

    const caption = "Lorem";
    const updatedCaption = "Ipsum";

    // when
    const wrapper = mount(ImageEdit, {
      global: {
        plugins: [vuetify],
      },
      // For form submissions
      attachTo: document.body,
      props: {
        imageId: demoImages.images[0]._id,
        caption,
      },
    });

    await wrapper.find("textarea").setValue(updatedCaption);
    await wrapper.find("button").trigger("click");
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    // then
    expect(imageController.updateImage).toBeCalledTimes(1);
    expect(imageController.updateImage).toBeCalledWith(
      store.auth.token,
      demoImages.images[0]._id,
      updatedCaption
    );
    expect(wrapper.text()).toContain(msg);
  });
  it("updates image", async () => {
    // given
    imageController.updateImage.mockResolvedValue(null);

    const caption = "Lorem";
    const updatedCaption = "Ipsum";

    // when
    const wrapper = mount(ImageEdit, {
      global: {
        plugins: [vuetify],
      },
      // For form submissions
      attachTo: document.body,
      props: {
        imageId: demoImages.images[0]._id,
        caption,
      },
    });

    await wrapper.find("textarea").setValue(updatedCaption);
    await wrapper.find("button").trigger("click");
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    // then
    expect(wrapper.text()).toContain("Caption updated!");
    expect(imageController.updateImage).toBeCalledTimes(1);
    expect(imageController.updateImage).toBeCalledWith(
      store.auth.token,
      demoImages.images[0]._id,
      updatedCaption
    );
  });
});
