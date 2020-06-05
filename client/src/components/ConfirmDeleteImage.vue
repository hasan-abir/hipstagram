<template>
  <div class="d-flex align-center modal-container" :class="{'px-6':$vuetify.breakpoint.xsOnly}">
    <div class="modal-closer" @click="toggleConfirmDelete(false)"></div>
    <v-card class="white mx-auto px-8 py-8 text-center" max-width="400" outlined>
      <p class="subtitle">Are you sure you want to delete this image?</p>
      <v-row class="mx-auto" justify="center">
        <v-btn
          color="blue-grey darken-2 white--text mr-2 px-8"
          @click="toggleConfirmDelete(false)"
        >No</v-btn>
        <v-btn color="red lighten-1 white--text px-8" @click="confirmDelete">yes</v-btn>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ConfirmDeleteImage",
  props: ["toggleConfirmDelete", "toggleModal", "imageId"],
  methods: {
    ...mapActions(["deleteImage"]),
    confirmDelete() {
      this.toggleConfirmDelete(false);
      this.deleteImage({
        imageId: this.imageId,
        toggleModal: this.toggleModal
      });
    }
  }
};
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 20;
}

.modal-closer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
}
</style>