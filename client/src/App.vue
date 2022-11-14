<script setup>
import { RouterView } from "vue-router";
import DynamicNavbar from "@/components/DynamicNavbar.vue";
</script>

<template>
  <v-app>
    <v-main>
      <DynamicNavbar />
      <v-container>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
