<script setup>
import { ref } from "vue";
import imageController from "@/controllers/imageController";
import { store } from "@/store";

const props = defineProps({
  imageId: String,
  caption: String,
});

const form = ref();
const valid = ref(false);
const success = ref(false);
const error = ref(null);
const loading = ref(false);
const updatedText = ref(props.caption);
const textRules = ref([(v) => !!v || "A caption is required to update"]);

const submitComment = async () => {
  if (valid.value) {
    try {
      error.value = null;
      loading.value = true;

      await imageController.updateImage(
        store.auth.token,
        props.imageId,
        updatedText.value
      );

      success.value = true;

      setTimeout(() => {
        success.value = false;
      }, 5000);
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
  <p class="mt-6 mb-4">Edit caption</p>
  <v-alert
    v-if="success"
    variant="tonal"
    type="success"
    density="compact"
    transition="fade-transition"
    class="font-weight-bold mb-4"
    >Caption updated!</v-alert
  >
  <v-alert
    v-if="error && error.body && error.body.msg"
    variant="tonal"
    type="error"
    density="compact"
    transition="fade-transition"
    class="font-weight-bold mb-4"
    >{{ error.body.msg }}</v-alert
  >
  <v-form
    v-model="valid"
    @submit.prevent="submitComment"
    ref="form"
    class="mb-4"
  >
    <v-textarea
      v-model="updatedText"
      :rules="textRules"
      label="Caption"
      required
      variant="outlined"
      rows="2"
    ></v-textarea>
    <v-btn color="primary" block dark type="submit" :disabled="loading"
      >Update</v-btn
    >
  </v-form>
</template>
