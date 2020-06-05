<template>
  <v-row
    :class="{'align-center':$vuetify.breakpoint.smAndUp}"
    justify="center"
    style="min-height: 100vh;"
    class="blue-grey darken-4 py-12 mx-0"
  >
    <v-col style="max-width: 400px;" :class="{'px-4':$vuetify.breakpoint.xsOnly}">
      <v-form @submit.prevent="submitForm" ref="form">
        <h1 class="white--text mb-6 display-1 text-center">Create an account</h1>
        <v-alert
          :value="errorMsg"
          type="error"
          dense
          border="left"
          transition="fade-transition"
        >{{ this.error }}</v-alert>
        <v-text-field
          v-model="username"
          :rules="usernameRules"
          label="Username"
          required
          dark
          filled
          background-color="blue-grey darken-3"
          @input="setError('')"
        ></v-text-field>

        <v-radio-group v-model="gender" row class="mt-0">
          <v-radio label="Male" value="male" dark></v-radio>
          <v-radio label="Female" value="female" dark></v-radio>
          <v-radio label="Don't want to share" value="unknown" dark></v-radio>
        </v-radio-group>

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

        <v-file-input
          v-model="avatar"
          :value="avatar"
          :rules="avatarRules"
          accept="image/png, image/jpeg, image/jpg"
          placeholder="Upload an avatar (optional)"
          prepend-icon="mdi-camera"
          label="Avatar"
          dark
          class="mb-3"
        ></v-file-input>

        <v-btn
          color="deep-purple accent-4 white--text"
          block
          dark
          :loading="loading"
          :disabled="disabled"
          type="submit"
        >Sign up</v-btn>
      </v-form>
      <p class="white--text mt-4 text-center">
        Already have an account?
        <router-link to="/login" class="deep-purple--text text--lighten-3">Login</router-link>
      </p>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Signup",
  data() {
    return {
      loading: false,
      disabled: false,
      username: "",
      usernameRules: [v => !!v || "Username is required"],
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
      gender: "unknown",
      avatar: null,
      avatarRules: [
        v => !v || v.size < 2000000 || "Maximum file size of 2 MB is accepted!"
      ],
      error: "",
      errorMsg: false
    };
  },
  computed: {
    ...mapGetters(["authError"])
  },
  methods: {
    ...mapActions(["signup", "clearError"]),
    submitForm() {
      this.toggleLoading(true);
      this.toggleDisable(true);
      if (this.$refs.form.validate()) {
        if (this.avatar === null || this.avatar === undefined) {
          this.signup({
            user: {
              username: this.username,
              email: this.email,
              password: this.password,
              gender: this.gender,
              avatar: null
            },
            toggleLoading: this.toggleLoading,
            toggleDisable: this.toggleDisable,
            setError: this.setError
          });
        } else {
          this.signup({
            user: {
              username: this.username,
              email: this.email,
              password: this.password,
              gender: this.gender,
              avatar: this.avatar
            },
            toggleLoading: this.toggleLoading,
            toggleDisable: this.toggleDisable,
            setError: this.setError
          });
        }
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
