<script setup>
import { ref, onMounted } from "vue";
import feedbackController from "@/controllers/feedbackController";
import { store } from "@/store";

const props = defineProps({
  imageId: String,
});

const likeCounter = ref(0);
const isLiked = ref(false);
const disabled = ref(false);
const error = ref(null);
const loading = ref(false);

const clickedLike = async () => {
  try {
    error.value = null;
    loading.value = true;
    disabled.value = true;

    if (isLiked.value) {
      const data = await feedbackController.unlikeImage(
        store.auth.token,
        props.imageId
      );

      likeCounter.value = data.likesCount;
      isLiked.value = data.isLiked;
    } else {
      const data = await feedbackController.likeImage(
        store.auth.token,
        props.imageId
      );
      likeCounter.value = data.likesCount;
      isLiked.value = data.isLiked;
    }
  } catch (err) {
    error.value = {
      body: err.response ? err.response.data : null,
      statusCode: err.response ? err.response.status : null,
    };
  } finally {
    loading.value = false;
    disabled.value = false;
  }
};

onMounted(async () => {
  try {
    loading.value = true;
    disabled.value = true;

    const data = await feedbackController.getLikesStatus(
      store.auth.token,
      props.imageId
    );

    likeCounter.value = data.likesCount;
    isLiked.value = data.isLiked;
  } catch (err) {
    error.value = {
      body: err.response ? err.response.data : null,
      statusCode: err.response ? err.response.status : null,
    };
  } finally {
    loading.value = false;
    disabled.value = false;
  }
});
</script>

<template>
  <v-alert
    v-if="error && error.body && error.body.msg"
    variant="tonal"
    type="error"
    density="compact"
    transition="fade-transition"
    class="font-weight-bold mb-4"
    >{{ error.body.msg }}</v-alert
  >
  <v-btn
    @click="clickedLike()"
    :prepend-icon="isLiked ? 'mdi-heart' : 'mdi-heart-outline'"
    color="primary"
    variant="tonal"
    size="large"
    rounded="pill"
    :loading="loading"
    :disabled="disabled"
  >
    {{ likeCounter }}
  </v-btn>
</template>
