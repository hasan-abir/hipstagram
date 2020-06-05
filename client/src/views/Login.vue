<template>
  <v-row
    :class="{'align-center':$vuetify.breakpoint.smAndUp}"
    justify="center"
    style="min-height: 100vh;"
    class="blue-grey darken-4 py-12 mx-0"
  >
    <v-col style="max-width: 400px;" :class="{'px-4':$vuetify.breakpoint.xsOnly}">
      <v-form v-model="valid" @submit.prevent="submitForm" ref="form">
        <h1 class="white--text mb-6 display-1 text-center">Login</h1>
        <v-alert
          :value="errorMsg"
          type="error"
          dense
          border="left"
          transition="fade-transition"
        >{{error}}</v-alert>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          required
          dark
          filled
          background-color="blue-grey darken-3"
          @input="setError('')"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          required
          dark
          filled
          background-color="blue-grey darken-3"
          @click:append="showPassword = !showPassword"
          @input="setError('')"
        ></v-text-field>

        <v-btn
          color="deep-purple accent-4 white--text"
          block
          dark
          :loading="loading"
          :disabled="disabled"
          type="submit"
        >Login</v-btn>
      </v-form>
      <p class="white--text mt-4 text-center">
        Don't have an account?
        <router-link to="/signup" class="deep-purple--text text--lighten-3">Sign up</router-link>
      </p>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      disabled: false,
      valid: true,
      email: "",
      emailRules: [
        v => !!v || "Email is required",
        v => /.+@.+\..+/.test(v) || "Email must be valid"
      ],
      password: "",
      showPassword: false,
      passwordRules: [
        v => !!v || "Password is required",
        v => (v && v.length > 8) || "Password must be at least of 8 characters"
      ],
      error: "",
      errorMsg: false
    };
  },
  methods: {
    ...mapActions(["login", "clearError"]),
    submitForm() {
      this.toggleLoading(true);
      this.toggleDisable(true);
      if (this.$refs.form.validate()) {
        this.login({
          user: {
            email: this.email,
            password: this.password
          },
          toggleLoading: this.toggleLoading,
          toggleDisable: this.toggleDisable,
          setError: this.setError
        });
      } else {
        this.toggleLoading(false);
        this.toggleDisable(false);
      }
    },
    toggleLoading(value) {
      this.loading = value;
    },
    toggleDisable(value) {
      this.disabled = value;
    },
    setError(value) {
      if (value === "") {
        this.error = "";
        this.errorMsg = false;
      } else {
        this.error = value;
        this.errorMsg = true;
      }
    }
  }
};
</script>

<style></style>
