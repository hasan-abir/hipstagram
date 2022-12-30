import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import axios from "axios";
import feedbackController from "@/controllers/feedbackController";
import { keyHeader } from "@/headers";
import demoImages from "../demoImages.json";

describe("FeedbackController", () => {
  beforeAll(() => {
    vi.mock("axios");
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("#likeImage()", () => {
    it("like the image", async () => {
      // given
      const token = "123";

      const response = { data: { likesCount: 1, isLiked: true } };
      axios.post.mockResolvedValue(response);

      // when
      const result = await feedbackController.likeImage(
        token,
        demoImages.images[0]._id
      );

      // then
      expect(result).toBe(response.data);
      expect(axios.post).toBeCalledTimes(1);
      expect(axios.post).toBeCalledWith(
        "/api/feedback/like/image/" + demoImages.images[0]._id,
        null,
        {
          headers: { ...keyHeader, authorization: "Bearer " + token },
        }
      );
    });
  });
  describe("#unlikeImage()", () => {
    it("unlike the image", async () => {
      // given
      const token = "123";

      const response = { data: { likesCount: 0, isLiked: false } };
      axios.delete.mockResolvedValue(response);

      // when
      const result = await feedbackController.unlikeImage(
        token,
        demoImages.images[0]._id
      );

      // then
      expect(result).toBe(response.data);
      expect(axios.delete).toBeCalledTimes(1);
      expect(axios.delete).toBeCalledWith(
        "/api/feedback/unlike/image/" + demoImages.images[0]._id,
        {
          headers: { ...keyHeader, authorization: "Bearer " + token },
        }
      );
    });
  });
  describe("#getLikesStatus()", () => {
    it("get the like counter and isLiked", async () => {
      // given
      const token = "123";
      const response = { data: { likesCount: 0, isLiked: false } };
      axios.get.mockResolvedValue(response);

      // when
      const result = await feedbackController.getLikesStatus(
        token,
        demoImages.images[0]._id
      );

      // then
      expect(result).toBe(response.data);
      expect(axios.get).toBeCalledTimes(1);
      expect(axios.get).toBeCalledWith(
        "/api/feedback/likes/image/" + demoImages.images[0]._id,
        {
          headers: { ...keyHeader, authorization: "Bearer " + token },
        }
      );
    });
  });
  describe("#commentOnImage()", () => {
    it("comment on image", async () => {
      // given
      const token = "123";
      const text = "Lorem ipsum";
      const response = {
        data: {
          text,
          author: {
            avatar: { file: "file", url: "url" },
            username: "Hasan Abir",
          },
        },
      };
      axios.post.mockResolvedValue(response);

      // when
      const result = await feedbackController.commentOnImage(
        token,
        demoImages.images[0]._id,
        text
      );

      // then
      expect(result).toBe(response.data);
      expect(axios.post).toBeCalledTimes(1);
      expect(axios.post).toBeCalledWith(
        "/api/feedback/comment/image/" + demoImages.images[0]._id,
        { text },
        {
          headers: { ...keyHeader, authorization: "Bearer " + token },
        }
      );
    });
  });
  describe("#removeCommentFromImage()", () => {
    it("remove comment from image", async () => {
      // given
      const token = "123";
      const commentId = "123";
      const response = { data: { msg: "Comment removed successfully" } };
      axios.delete.mockResolvedValue(response);

      // when
      const result = await feedbackController.removeCommentFromImage(
        token,
        commentId
      );

      // then
      expect(result).toBe(response.data);
      expect(axios.delete).toBeCalledTimes(1);
      expect(axios.delete).toBeCalledWith(
        "/api/feedback/comment/" + commentId,
        {
          headers: { ...keyHeader, authorization: "Bearer " + token },
        }
      );
    });
  });
  describe("#getLatestComments()", () => {
    it("get latest comments", async () => {
      // given
      const comments = [{ text: "Lorem" }, { text: "Ip" }, { text: "Sum" }];
      const response = { data: { comments, next: "timestamp" } };
      axios.get.mockResolvedValue(response);

      // when
      const result = await feedbackController.getLatestComments(
        demoImages.images[0]._id
      );

      // then
      expect(result).toBe(response.data);
      expect(axios.get).toBeCalledTimes(1);
      expect(axios.get).toBeCalledWith(
        "/api/feedback/comments/image/" + demoImages.images[0]._id,
        {
          headers: keyHeader,
          params: {
            limit: undefined,
            next: undefined,
          },
        }
      );
    });
  });
});
3;
