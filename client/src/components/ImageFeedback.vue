<script setup>
import getUploadDate from "@/utils/getUploadDate";
import ImageLike from "@/components/ImageLike.vue";
import ImageComment from "@/components/ImageComment.vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  image: Object,
});
</script>

<template>
  <RouterLink
    style="color: black; text-decoration: none"
    :to="'/user/' + props.image.author.username"
  >
    <v-avatar
      :image="props.image.author.avatar.url + '?tr=ar-1-1'"
      class="mr-4 mb-2"
    ></v-avatar>
    <h1 class="d-inline text-h5 text-sm-h6">
      {{ props.image.author.username }}
    </h1>
  </RouterLink>

  <p class="text-subtitle-1 text-grey mb-2">
    Uploaded {{ getUploadDate(props.image.createdAt) }} ago
  </p>
  <p class="mb-4" v-if="props.image.caption.length > 0">
    {{ props.image.caption }}
  </p>

  <ImageLike :imageId="props.image._id" />
  <v-divider class="my-4"></v-divider>
  <ImageComment :imageId="props.image._id" />
</template>
