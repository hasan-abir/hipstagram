<script setup>
import { ref } from "vue";
import { store } from "@/store";
import imageController from "@/controllers/imageController";

const emit = defineEmits(["image-upload"]);

const valid = ref(false);
const form = ref(null);
const loading = ref(false);
const success = ref(false);
const image = ref([]);
const imageRules = ref([
  (v) => !!v || "Image is required",
  (v) =>
    !v ||
    !v.length ||
    v[0].size < 2000000 ||
    "Maximum file size of 2 MB is accepted!",
]);
const caption = ref("");
const error = ref(null);

const uploadImage = async () => {
  if (valid.value && image.value.length > 0) {
    try {
      error.value = null;
      loading.value = true;

      await imageController.uploadImage(
        store.auth.token,
        image.value[0],
        caption.value
      );

      emit("image-upload");

      success.value = true;

      setTimeout(() => {
        success.value = false;
      }, 5000);

      image.value = [];
      form.reset();
    } catch (err) {
      error.value = {
        body: err.response ? err.response.data : null,
        statusCode: err.response ? err.response.status : null,
      };
    } finally {
      loading.value = false;
    }
  }
};
</script>

<template>
  <div style="max-width: 400px">
    <v-alert
      v-if="success"
      variant="tonal"
      type="success"
      density="compact"
      transition="fade-transition"
      class="font-weight-bold mb-4"
      >Image uploaded</v-alert
    >
    <v-alert
      v-if="error && error.body && error.body.msg"
      variant="tonal"
      :icon="false"
      type="error"
      density="compact"
      transition="fade-transition"
      class="font-weight-bold mb-4"
      >{{ error.body.msg }}</v-alert
    >

    <v-form v-model="valid" @submit.prevent="uploadImage" ref="form">
      <v-textarea
        v-model="caption"
        label="Caption"
        variant="outlined"
        rows="2"
      ></v-textarea>
      <div class="d-flex align-center">
        <v-file-input
          v-model="image"
          :rules="imageRules"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          prepend-icon="mdi-camera"
          variant="underlined"
          label="Image"
          dark
          class="mr-2"
        ></v-file-input>
        <v-btn
          color="primary"
          dark
          type="submit"
          :loading="loading"
          :disabled="loading"
          >Upload</v-btn
        >
      </div>
    </v-form>
  </div>
</template>
