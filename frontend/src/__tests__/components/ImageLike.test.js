import ImageLike from "@/components/ImageLike.vue";
import vuetify from "@/plugins/vuetify";
import { mount } from "@vue/test-utils";
import { afterAll, describe, expect, it, vi } from "vitest";
import feedbackController from "@/controllers/feedbackController";
import { store } from "@/store";
import { nextTick } from "vue";

describe("ImageLike", () => {
  beforeAll(() => {
    vi.mock("@/controllers/feedbackController");

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
    const returnValue = {
      likesCount: 1,
      isLiked: true,
    };
    feedbackController.getLikesStatus.mockResolvedValue(returnValue);
    const imageId = "456";

    // when
    const wrapper = mount(ImageLike, {
      global: {
        plugins: [vuetify],
      },
      props: {
        imageId,
      },
    });

    // Wait to update the DOM
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    // then
    expect(wrapper.text()).toContain(returnValue.likesCount);
    expect(feedbackController.getLikesStatus).toBeCalledTimes(1);
    expect(feedbackController.getLikesStatus).toBeCalledWith(
      store.auth.token,
      imageId
    );
  });
  it("error from backend is visible", async () => {
    // given
    const msg = "Error from backend";
    feedbackController.getLikesStatus.mockImplementation(() => {
      const err = new Error();
      err.response = { data: { msg }, status: 500 };

      throw err;
    });
    const imageId = "456";

    // when
    const wrapper = mount(ImageLike, {
      global: {
        plugins: [vuetify],
      },
      props: {
        imageId,
      },
    });

    // Wait to update the DOM
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    // then
    expect(feedbackController.getLikesStatus).toBeCalledTimes(1);
    expect(feedbackController.getLikesStatus).toBeCalledWith(
      store.auth.token,
      imageId
    );
    expect(wrapper.text()).toContain(msg);
  });
  it("likes image", async () => {
    // given
    const imageId = "456";
    const initialStatus = {
      likesCount: 0,
      isLiked: false,
    };
    feedbackController.getLikesStatus.mockResolvedValue(initialStatus);
    const likedStatus = {
      likesCount: 1,
      isLiked: true,
    };
    feedbackController.likeImage.mockResolvedValue(likedStatus);

    // when
    const wrapper = mount(ImageLike, {
      global: {
        plugins: [vuetify],
      },
      props: {
        imageId,
      },
    });

    // Wait to update the DOM
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();
    await wrapper.find("button").trigger("click");
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    // then
    expect(wrapper.text()).toContain(likedStatus.likesCount);
    expect(feedbackController.getLikesStatus).toBeCalledTimes(1);
    expect(feedbackController.getLikesStatus).toBeCalledWith(
      store.auth.token,
      imageId
    );
    expect(feedbackController.likeImage).toBeCalledTimes(1);
    expect(feedbackController.likeImage).toBeCalledWith(
      store.auth.token,
      imageId
    );
  });
  it("unlikes image", async () => {
    // given
    const imageId = "456";
    const initialStatus = {
      likesCount: 1,
      isLiked: true,
    };
    feedbackController.getLikesStatus.mockResolvedValue(initialStatus);
    const unlikedStatus = {
      likesCount: 0,
      isLiked: false,
    };
    feedbackController.unlikeImage.mockResolvedValue(unlikedStatus);

    // when
    const wrapper = mount(ImageLike, {
      global: {
        plugins: [vuetify],
      },
      props: {
        imageId,
      },
    });

    // Wait to update the DOM
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();
    await wrapper.find("button").trigger("click");
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    // then
    expect(wrapper.text()).toContain(unlikedStatus.likesCount);
    expect(feedbackController.getLikesStatus).toBeCalledTimes(1);
    expect(feedbackController.getLikesStatus).toBeCalledWith(
      store.auth.token,
      imageId
    );
    expect(feedbackController.unlikeImage).toBeCalledTimes(1);
    expect(feedbackController.unlikeImage).toBeCalledWith(
      store.auth.token,
      imageId
    );
  });
});
