<script setup>
import { ref } from "vue";
import { store } from "@/store";
import { RouterLink } from "vue-router";

const valid = ref(false);
const loading = ref(false);
const disabled = ref(false);
const email = ref("");
const emailRules = ref([
  (v) => !!v || "Email is required",
  (v) => /.+@.+\..+/.test(v) || "Email must be valid",
]);
const password = ref("");
const passwordRules = ref([
  (v) => !!v || "Password is required",
  (v) => (v && v.length >= 8) || "Password must be at least of 8 characters",
]);
const showPassword = ref(false);
const error = ref(null);

const submitForm = async () => {
  if (valid.value) {
    error.value = null;
    loading.value = true;
    disabled.value = true;

    try {
      await store.login(email.value, password.value);
    } catch (err) {
      error.value = {
        body: err.response ? err.response.data : null,
        statusCode: err.response ? err.response.statusCode : null,
      };

      loading.value = false;
      disabled.value = false;
    }
  }
};
</script>

<template>
  <v-row justify="center" class="py-12 mx-0">
    <v-col style="max-width: 400px" class="px-4 px-sm-4">
      <v-form v-model="valid" @submit.prevent="submitForm" ref="form">
        <h1 class="mb-6 display-1 text-center">Login</h1>
        <template v-if="error">
          <v-alert
            v-if="error.body.msg"
            prominent
            type="error"
            density="compact"
            variant="tonal"
            transition="fade-transition"
            class="font-weight-bold mb-4"
            >{{ error.body.msg }}</v-alert
          >
          <template v-else>
            <v-alert
              v-for="(value, key) in error.body"
              :key="key"
              prominent
              type="error"
              density="compact"
              variant="tonal"
              transition="fade-transition"
              class="font-weight-bold mb-4"
            >
              <strong>{{ value }}</strong>
            </v-alert>
          </template>
        </template>
        <v-text-field
          v-model="email"
          label="Email"
          :rules="emailRules"
          required
          dark
          filled
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          :rules="passwordRules"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          required
          dark
          filled
        ></v-text-field>

        <v-btn
          color="primary"
          block
          dark
          type="submit"
          :loading="loading"
          :disabled="disabled"
          >Login</v-btn
        >
      </v-form>
      <p class="mt-4 text-center">
        Don't have an account?
        <RouterLink to="/register">Sign up</RouterLink>
      </p>
    </v-col>
  </v-row>
</template>
