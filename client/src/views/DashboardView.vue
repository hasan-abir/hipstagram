<script setup>
import ImageGrid from "@/components/ImageGrid.vue";
import { store } from "@/store";
</script>

<template>
  <section class="pt-16">
    <p>
      Welcome, <b>{{ store.auth.user && store.auth.user.username }}</b
      >!
    </p>
    <v-divider class="my-4"></v-divider>
    <h1 class="font-weight-bold mb-12 text-h4 text-sm-h5">Uploaded Images</h1>
    <ImageGrid :username="store.auth.user && store.auth.user.username" />
  </section>
</template>
