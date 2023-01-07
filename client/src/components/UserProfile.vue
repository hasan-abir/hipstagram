<script setup>
import ImageGrid from "@/components/ImageGrid.vue";

const props = defineProps({
  user: Object,
});
</script>

<template>
  <div v-if="props.user" class="d-flex align-center">
    <v-avatar
      :image="props.user.avatar.url + '?tr=ar-1-1'"
      class="mr-4 mb-2"
      size="60"
    ></v-avatar>
    <h1 class="font-weight-bold text-h4 text-sm-h5">
      {{ props.user.username }}
    </h1>
  </div>
  <v-divider class="my-4"></v-divider>
  <ImageGrid :username="props.user && props.user.username" />
</template>
