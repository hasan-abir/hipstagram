<script setup>
import UserProfile from "@/components/UserProfile.vue";
import { onMounted, ref } from "vue";
import authController from "@/controllers/authController";
import { useRoute } from "vue-router";

const route = useRoute();

const user = ref(null);
const error = ref(null);
const loading = ref(false);

onMounted(async () => {
  try {
    loading.value = true;

    const data = await authController.getUserByUsername(route.params.username);

    user.value = data;
  } catch (err) {
    error.value = {
      body: err.response ? err.response.data : null,
      statusCode: err.response ? err.response.status : null,
    };
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="pt-16">
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
    <v-row class="mx-0" justify="center" v-if="loading">
      <v-progress-circular
        indeterminate
        dark
        class="my-6"
      ></v-progress-circular>
    </v-row>
    <UserProfile v-else-if="user" :user="user" />
  </section>
</template>
