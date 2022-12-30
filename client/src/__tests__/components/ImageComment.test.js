import ImageComment from "@/components/ImageComment.vue";
import feedbackController from "@/controllers/feedbackController";
import vuetify from "@/plugins/vuetify";
import { store } from "@/store";
import { mount } from "@vue/test-utils";
import { afterAll, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import demoComments from "../demoComments.json";

describe("ImageComment", () => {
  beforeAll(() => {
    vi.mock("@/controllers/feedbackController");

    store.auth.user = {
      avatar: {
        url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
        fileId: "male",
      },
      username: "Hasan Abir",
      gender: "male",
      email: "hasanabir@test.com",
      createdAt: "2022-12-19T05:09:48.031Z",
      updatedAt: "2022-12-19T05:09:48.031Z",
    };
    store.auth.token = "123";
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  afterAll(() => {
    store.auth.token = null;
    store.auth.user = null;
  });
  it("renders correctly", async () => {
    // given
    feedbackController.getLatestComments.mockResolvedValue(demoComments);
    const imageId = "456";

    // when
    const wrapper = mount(ImageComment, {
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
    expect(wrapper.text()).toContain(demoComments.comments[0].text);
    expect(wrapper.text()).toContain(demoComments.comments[1].text);
    expect(wrapper.text()).toContain(demoComments.comments[2].text);
    expect(feedbackController.getLatestComments).toBeCalledTimes(1);
    expect(feedbackController.getLatestComments).toBeCalledWith(
      imageId,
      10,
      null
    );
  });
  it("posts comment", async () => {
    // given
    const imageId = "456";
    const initialComments = { ...demoComments };
    initialComments.comments = initialComments.comments.slice(0, -1);
    feedbackController.getLatestComments.mockResolvedValue(initialComments);
    const lastCommentFromArr =
      demoComments.comments[demoComments.comments.length - 1];
    feedbackController.commentOnImage.mockResolvedValue(lastCommentFromArr);

    // when
    const wrapper = mount(ImageComment, {
      global: {
        plugins: [vuetify],
      },
      // For form submissions
      attachTo: document.body,
      props: {
        imageId,
      },
    });

    // Wait to update the DOM
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();
    const commentInput = wrapper.find("textarea");
    await commentInput.setValue(lastCommentFromArr.text);
    await wrapper.find("button").trigger("click");
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    // then
    expect(wrapper.text()).toContain(lastCommentFromArr.text);
    expect(feedbackController.getLatestComments).toBeCalledTimes(1);
    expect(feedbackController.getLatestComments).toBeCalledWith(
      imageId,
      10,
      null
    );
    expect(feedbackController.commentOnImage).toBeCalledTimes(1);
    expect(feedbackController.commentOnImage).toBeCalledWith(
      store.auth.token,
      imageId,
      lastCommentFromArr.text
    );
  });
  it("clicked delete", async () => {
    // given
    const imageId = "456";
    feedbackController.getLatestComments.mockResolvedValue(demoComments);
    feedbackController.removeCommentFromImage.mockResolvedValue(null);

    // when
    const wrapper = mount(ImageComment, {
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
    await wrapper.findAll("button").at(1).trigger("click");
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    // then
    expect(wrapper.text().includes(demoComments.comments[0].text)).toBeFalsy();
    expect(feedbackController.getLatestComments).toBeCalledTimes(1);
    expect(feedbackController.getLatestComments).toBeCalledWith(
      imageId,
      10,
      null
    );
    expect(feedbackController.removeCommentFromImage).toBeCalledTimes(1);
    expect(feedbackController.removeCommentFromImage).toBeCalledWith(
      store.auth.token,
      demoComments.comments[0]._id
    );
  });
});
