import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import axios from "axios";
import authController from "@/controllers/authController";
import { keyHeader } from "@/headers";

describe("AuthController", () => {
  beforeAll(() => {
    vi.mock("axios");
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("#getCurrentUser()", () => {
    it("should get the user", async () => {
      // given
      const token = "123";

      const response = { data: { username: "Hasan Abir" } };
      axios.get.mockResolvedValue(response);

      // when
      const result = await authController.getCurrentUser(token);

      // then
      expect(result).toBe(response.data);
      expect(axios.get).toBeCalledTimes(1);
      expect(axios.get).toBeCalledWith("/api/auth/currentuser", {
        headers: { ...keyHeader, authorization: "Bearer " + token },
      });
    });
  });
  describe("#getUserByUsername()", () => {
    it("should get the user by username", async () => {
      // given
      const username = "Hasan Abir";
      const response = { data: { username } };
      axios.get.mockResolvedValue(response);

      // when
      const result = await authController.getUserByUsername(username);

      // then
      expect(result).toBe(response.data);
      expect(axios.get).toBeCalledTimes(1);
      expect(axios.get).toBeCalledWith("/api/auth/user/" + username, {
        headers: keyHeader,
      });
    });
  });
  describe("#login()", () => {
    it("should login", async () => {
      // given
      const userBody = { email: "hasanabir@test.com", password: "testtest" };
      const response = { data: { token: "123" } };
      axios.post.mockResolvedValue(response);

      // when
      const result = await authController.login(userBody);

      // then
      expect(result).toBe(response.data.token);
      expect(axios.post).toBeCalledTimes(1);
      expect(axios.post).toBeCalledWith("/api/auth/login", userBody, {
        headers: keyHeader,
      });
    });
  });
  describe("#register()", () => {
    it("should register", async () => {
      // given
      const userBody = {
        username: "Hasan Abir",
        gender: "male",
        avatar: null,
        email: "hasanabir@test.com",
        password: "testtest",
      };
      const response = { data: { token: "123" } };
      axios.post.mockResolvedValue(response);

      // when
      const result = await authController.register(userBody);

      // then
      expect(result).toBe(response.data.token);
      expect(axios.post).toBeCalledTimes(1);
      expect(axios.post).toBeCalledWith("/api/auth/register", userBody, {
        headers: keyHeader,
      });
    });
  });
});
