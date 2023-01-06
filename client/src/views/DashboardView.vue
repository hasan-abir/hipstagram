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
    <ImageGrid :username="store.auth.user && store.auth.user.username" />
  </section>
</template>
