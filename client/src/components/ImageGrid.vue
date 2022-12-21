<script setup>
import { onMounted, ref } from "vue";
import imageController from "@/controllers/imageController";
import ImageCard from "@/components/ImageCard.vue";

const loading = ref(true);
const images = ref([]);
const nextImage = ref(null);
const limit = ref(10);
const error = ref(null);
const loadImages = async () => {
  try {
    loading.value = true;

    const data = await imageController.getLatestImages(
      limit.value,
      nextImage.value,
      null
    );

    images.value.push(...data.images);
    nextImage.value = data.next;
  } catch (err) {
    error.value = {
      body: err.response ? err.response.data : null,
      statusCode: err.response ? err.response.status : null,
    };
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadImages();
});
</script>

<template>
  <v-alert
    v-if="error && error.body && error.body.msg"
    prominent
    type="error"
    density="compact"
    variant="tonal"
    transition="fade-transition"
    class="font-weight-bold mb-4"
    >{{ error.body.msg }}</v-alert
  >

  <div class="css-grid">
    <ImageCard v-for="image in images" :image="image" :key="image._id" />
  </div>
  <v-row class="mx-0" justify="center" v-if="loading">
    <v-progress-circular indeterminate dark class="my-6"></v-progress-circular>
  </v-row>
  <v-row class="mx-0" justify="center" v-if="nextImage">
    <v-btn
      @click="loadImages()"
      :disabled="loading"
      variant="text"
      class="mt-12"
      dark
      >Show more</v-btn
    >
  </v-row>
</template>

<style scoped>
.css-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;
  padding-bottom: 1rem;
}

@media (max-width: 600px) {
  .css-grid {
    grid-template-columns: 1fr;
  }
}
</style>
