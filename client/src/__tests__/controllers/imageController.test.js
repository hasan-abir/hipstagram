import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import axios from "axios";
import imageController from "@/controllers/imageController";
import { keyHeader } from "@/headers";

describe("AuthController", () => {
  beforeAll(() => {
    vi.mock("axios");
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("#getLatestImages()", () => {
    it("should get images", async () => {
      // given
      const limit = 5;
      const next = "someFileId";
      const username = "Hasan Abir";
      const response = {
        images: [{ file: "urlOne" }, { file: "urlTwo" }],
        next: "fileId",
      };
      axios.get.mockResolvedValue(response);

      // when
      const result = await imageController.getLatestImages(
        limit,
        next,
        username
      );

      // then
      expect(result).toBe(response.data);
      expect(axios.get).toBeCalledTimes(1);
      expect(axios.get).toBeCalledWith("/api/images/latest", {
        headers: { ...keyHeader },
        params: {
          limit,
          next,
          username,
        },
      });
    });
  });
  describe("#getSingleImage()", () => {
    it("should get an image", async () => {
      // given
      const imageId = "imageId";
      const response = { file: "url" };
      axios.get.mockResolvedValue(response);

      // when
      const result = await imageController.getSingleImage(imageId);

      // then
      expect(result).toBe(response.data);
      expect(axios.get).toBeCalledTimes(1);
      expect(axios.get).toBeCalledWith("/api/images/details/" + imageId, {
        headers: { ...keyHeader },
      });
    });
  });
  describe("#uploadImage()", () => {
    it("should upload an image", async () => {
      // given
      const token = "123";
      const file = "fileObj";
      const caption = "Lorem";
      const response = { file: "url" };
      axios.post.mockResolvedValue(response);

      const formData = new FormData();

      formData.set("file", file);
      formData.set("caption", caption);

      // when
      const result = await imageController.uploadImage(token, file, caption);

      // then
      expect(result).toBe(response.data);
      expect(axios.post).toBeCalledTimes(1);
      expect(axios.post).toBeCalledWith("/api/images/upload", formData, {
        headers: { ...keyHeader, authorization: "Bearer " + token },
      });
    });
  });
  describe("#removeImage()", () => {
    it("should remove image", async () => {
      // given
      const token = "123";
      const imageId = "fileId";
      axios.delete.mockResolvedValue({ msg: "Deleted" });

      // when
      await imageController.removeImage(token, imageId);

      // then
      expect(axios.delete).toBeCalledTimes(1);
      expect(axios.delete).toBeCalledWith("/api/images/remove/" + imageId, {
        headers: { ...keyHeader, authorization: "Bearer " + token },
      });
    });
  });
  describe("#updateImage()", () => {
    it("should update an image", async () => {
      // given
      const token = "123";
      const imageId = "imageId";
      const caption = "Lorem";
      const response = { file: "url" };
      axios.put.mockResolvedValue(response);

      // when
      const result = await imageController.updateImage(token, imageId, caption);

      // then
      expect(result).toBe(response.data);
      expect(axios.put).toBeCalledTimes(1);
      expect(axios.put).toBeCalledWith(
        "/api/images/edit/" + imageId,
        { caption },
        {
          headers: { ...keyHeader, authorization: "Bearer " + token },
        }
      );
    });
  });
});
