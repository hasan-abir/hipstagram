<template>
  <div>
    <h1
      class="blue-grey--text text--lighten-2 mb-4 text-center"
      :class="{'subtitle-1':$vuetify.breakpoint.xsOnly, 'headline': $vuetify.breakpoint.smAndUp}"
    >Upload any image you like!</h1>

    <v-row class="mx-0">
      <v-col cols="12" sm="8" md="8" lg="8" class="px-0 mx-auto">
        <v-form @submit.prevent="submitForm">
          <v-alert
            :value="successMsg"
            type="success"
            dense
            border="left"
            transition="fade-transition"
          >{{this.success}}</v-alert>
          <v-alert
            :value="errorMsg"
            type="error"
            dense
            border="left"
            transition="fade-transition"
          >{{this.error}}</v-alert>
          <v-row
            class="mx-0"
            :class="{'justify-center': $vuetify.breakpoint.xsOnly, 'justify-between': $vuetify.breakpoint.smAndUp}"
          >
            <v-text-field
              :class="{'mr-4': $vuetify.breakpoint.smAndUp}"
              v-model="description"
              label="Caption (optional)"
              dark
              filled
              background-color="blue-grey darken-3"
            ></v-text-field>
            <label for="image-upload" class="d-block" style="cursor: pointer;">
              <v-btn class="blue-grey darken-3" dark fab depressed style="pointer-events: none;">
                <v-icon large>mdi-camera</v-icon>
              </v-btn>
            </label>
            <v-file-input
              id="image-upload"
              v-model="image"
              :value="image"
              class="d-none"
              @change="checkUpload"
            ></v-file-input>
          </v-row>
          <v-row class="mx-0 mb-6" v-if="imagePreview !== ''">
            <v-col class="mx-auto blue-grey darken-3" cols="auto">
              <v-card dark class="blue-grey darken-3" style="position: relative;">
                <v-img :src="imagePreview" height="200" width="200"></v-img>
                <v-btn
                  fab
                  x-small
                  color="blue-grey darken-4"
                  style="position: absolute; top: 4px; right: 4px;"
                  @click="closePreview"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
          <v-btn
            type="submit"
            dark
            color="deep-purple accent-3"
            :loading="loading"
            :disabled="disabled"
            block
          >Upload</v-btn>
        </v-form>
      </v-col>
    </v-row>
    <hr class="blue-grey darken-2 my-8" />
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "UploadImage",
  data() {
    return {
      valid: false,
      description: "",
      image: null,
      imagePreview: "",
      error: "",
      errorMsg: false,
      success: "",
      successMsg: false,
      loading: false,
      disabled: false
    };
  },
  methods: {
    ...mapActions(["addImage"]),
    checkUpload(e) {
      const file = e;

      this.errorMsg = false;
      this.error = "";
      if (
        file.type !== "image/png" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/jpg"
      ) {
        this.imagePreview = "";
        this.setError("Please upload only JPG/JPEG or PNG images.");
      }
      if (file.size > 2 * 1024 * 1024) {
        this.imagePreview = "";
        this.setError("Maximum file size of 2 MB is accepted");
      }
      if (!this.errorMsg) {
        const url = URL.createObjectURL(file);
        this.imagePreview = url;
      }
    },
    closePreview() {
      if (!this.loading) {
        this.imagePreview = "";
        this.image = null;
      }
    },
    toggleLoading(value) {
      this.loading = value;
    },
    toggleDisabled(value) {
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
    },
    setSuccess(value) {
      if (value === "") {
        this.success = "";
        this.successMsg = false;
      } else {
        this.success = value;
        this.successMsg = true;
      }
    },
    clearForm() {
      this.image = null;
      this.imagePreview = "";
      this.description = "";
    },
    submitForm() {
      if (this.image === null || this.image === undefined) {
        this.setError("Please pick an image before uploading.");
      } else if (this.errorMsg) {
        return;
      } else {
        this.toggleLoading(true);
        this.toggleDisabled(true);

        this.addImage({
          data: {
            image: this.image,
            description: this.description
          },
          toggleLoading: this.toggleLoading,
          toggleDisabled: this.toggleDisabled,
          setError: this.setError,
          setSuccess: this.setSuccess,
          clearForm: this.clearForm
        });
      }
    }
  }
};
</script>

<style>
</style>