<script setup>
import { ref } from "vue";
import { store } from "@/store";

const valid = ref(false);
const form = ref(null);
const loading = ref(false);
const username = ref("");
const usernameRules = ref([(v) => !!v || "Username is required"]);
const gender = ref("other");
const avatar = ref([]);
const avatarRules = ref([
  (v) =>
    !v ||
    !v.length ||
    v[0].size < 2000000 ||
    "Maximum file size of 2 MB is accepted!",
]);
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

    try {
      await store.register(
        username.value,
        gender.value,
        avatar.value,
        email.value,
        password.value
      );
    } catch (err) {
      error.value = {
        body: err.response ? err.response.data : null,
        statusCode: err.response ? err.response.status : null,
      };

      loading.value = false;
    }
  }
};
</script>

<template>
  <v-row justify="center" class="py-12 mx-0">
    <v-col style="max-width: 400px" class="px-4 px-sm-4">
      <v-form v-model="valid" @submit.prevent="submitForm" ref="form">
        <h1 class="mb-6 display-1 text-center">Create an account</h1>
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
          v-model="username"
          :rules="usernameRules"
          label="Username"
          required
          dark
          filled
        ></v-text-field>

        <v-radio-group v-model="gender" row class="mt-0">
          <v-radio label="Male" value="male" dark></v-radio>
          <v-radio label="Female" value="female" dark></v-radio>
          <v-radio label="Other" value="other" dark></v-radio>
        </v-radio-group>

        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          required
          dark
          filled
        ></v-text-field>
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          required
          dark
          filled
          @click:append="showPassword = !showPassword"
        ></v-text-field>

        <v-file-input
          v-model="avatar"
          :rules="avatar.length > 0 ? avatarRules : []"
          accept="image/png, image/jpeg, image/jpg"
          placeholder="Upload an avatar (optional)"
          prepend-icon="mdi-camera"
          label="Avatar"
          dark
          class="mb-3"
        ></v-file-input>

        <v-btn
          color="primary"
          block
          dark
          :loading="loading"
          :disabled="loading"
          type="submit"
          >Sign up</v-btn
        >
      </v-form>
      <p class="mt-4 text-center">
        Already have an account?
        <RouterLink to="/login">Login</RouterLink>
      </p>
    </v-col>
  </v-row>
</template>
