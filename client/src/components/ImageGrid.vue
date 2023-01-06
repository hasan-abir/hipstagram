<script setup>
import ImageCard from "@/components/ImageCard.vue";
import UploadImage from "@/components/UploadImage.vue";
import imageController from "@/controllers/imageController";
import { onMounted, ref } from "vue";

const componentProps = defineProps({
  username: String,
});

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
      componentProps.username
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

const refreshImages = async () => {
  images.value = [];
  nextImage.value = null;

  await loadImages();
};

onMounted(async () => {
  await loadImages();
});
</script>

<template>
  <v-alert
    v-if="error && error.body && error.body.msg"
    prominent
    :icon="false"
    type="error"
    density="compact"
    variant="tonal"
    transition="fade-transition"
    class="font-weight-bold mb-4"
    >{{ error.body.msg }}</v-alert
  >
  <template v-if="$route.name === 'dashboard'">
    <h1 class="font-weight-bold mb-12 text-h4 text-sm-h5">Upload an image</h1>
    <UploadImage @image-upload="refreshImages()" />
    <v-divider class="my-4"></v-divider>
    <h1 class="font-weight-bold mb-12 text-h4 text-sm-h5">Uploaded Images</h1>
  </template>
  <div class="css-grid">
    <v-hover v-for="image in images" :key="image._id">
      <template v-slot:default="{ isHovering, props }">
        <ImageCard
          :image="image"
          :isHovering="isHovering"
          :props="props"
          :editable="$route.name === 'dashboard'"
          @image-delete="refreshImages()"
        />
      </template>
    </v-hover>
  </div>
  <v-row class="mx-0" justify="center" v-if="loading">
    <v-progress-circular indeterminate dark class="my-6"></v-progress-circular>
  </v-row>
  <p v-else-if="images.length === 0">No images uploaded... yet</p>

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
