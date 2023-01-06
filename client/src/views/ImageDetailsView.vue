<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import imageController from "@/controllers/imageController";
import ImageFeedback from "@/components/ImageFeedback.vue";
import { useDisplay } from "vuetify";

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const overlay = ref(true);
const image = ref(null);
const error = ref(null);

const { smAndUp } = useDisplay();

const closeDetails = () => {
  if (router.options.history.state.back && route.name !== "image-details") {
    router.back();
  } else {
    router.push("/");
  }
};

onMounted(async () => {
  try {
    loading.value = true;

    const data = await imageController.getSingleImage(route.params.id);
    image.value = data;
  } catch (err) {
    error.value = {
      body: err.response.data,
      statusCode: err.response.status,
    };
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <v-overlay
    v-model="overlay"
    theme="light"
    @click:outside="closeDetails()"
    class="align-center justify-center"
    content-class="w-100 h-100 pointer-events-none d-flex align-center"
  >
    <section class="w-100" :class="{ 'h-75': smAndUp, 'h-100': !smAndUp }">
      <v-container class="h-100">
        <v-row class="mx-0" justify="center" v-if="loading">
          <v-progress-circular
            indeterminate
            dark
            class="my-6"
          ></v-progress-circular>
        </v-row>
        <v-alert
          v-if="error && error.statusCode === 404"
          prominent
          :icon="false"
          type="error"
          density="compact"
          transition="fade-transition"
          class="font-weight-bold mb-4"
          >Image not found!</v-alert
        >
        <v-card
          v-else-if="image"
          class="pointer-events-auto h-100"
          style="position: relative"
          min-height="500px"
        >
          <v-btn
            color="white"
            icon="mdi-close"
            class="back-btn ma-2"
            elevation="0"
            position="absolute"
            size="small"
            @click="closeDetails()"
          ></v-btn>
          <v-row class="h-100 overflow-auto" no-gutters>
            <v-col
              cols="12"
              sm="9"
              class="bg-black"
              :class="{ 'h-100 sticky': smAndUp }"
            >
              <v-img
                :src="image.file.url + '?tr=w-800'"
                :lazy-src="image.file.url + '?tr=w-16'"
                :alt="image.caption"
                aspect-ratio="1"
                height="100%"
              ></v-img>
            </v-col>
            <v-col cols="12" sm="3" class="pa-4">
              <ImageFeedback :image="image" />
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </section>
  </v-overlay>
</template>

<style scoped>
.back-btn {
  top: 0;
  right: 0;
  z-index: 1;
}

.sticky {
  position: sticky;
  top: 0;
}
</style>
