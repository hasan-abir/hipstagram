<script setup>
import { RouterView } from "vue-router";
import DynamicNavbar from "@/components/DynamicNavbar.vue";
import { store } from "@/store";
</script>

<template>
  <v-app>
    <v-main>
      <DynamicNavbar />
      <v-container>
        <div v-if="store.auth.loading" class="text-center">
          <v-progress-circular indeterminate dark></v-progress-circular>
        </div>
        <RouterView v-else />
      </v-container>
    </v-main>
  </v-app>
</template>
