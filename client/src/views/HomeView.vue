<script setup>
import ImageGrid from "@/components/ImageGrid.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <section class="pt-16">
    <h1 class="font-weight-bold mb-4 mb-sm-0 text-h4 text-sm-h5">
      Here are the latest pictures uploaded by users!
    </h1>
    <p class="text-body-1 mb-12">To upload yours, you need to be logged in.</p>
    <ImageGrid />
    <RouterView v-if="$route.name === 'image-details'" :key="$route.fullPath" />
  </section>
</template>
