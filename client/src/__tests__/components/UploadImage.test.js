import UploadImage from "@/components/UploadImage.vue";
import vuetify from "@/plugins/vuetify";
import { store } from "@/store";
import { mount } from "@vue/test-utils";
import { afterAll, describe, expect, it, vi } from "vitest";

describe("UploadImage", () => {
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
    const wrapper = mount(UploadImage, {
      global: {
        plugins: [vuetify],
      },
    });

    // then
    expect(wrapper.text()).toContain("Upload");
  });
});
