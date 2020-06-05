<template>
  <v-form class="mb-8" @submit.prevent="editImageId">
    <v-textarea
      v-model="description"
      label="Description"
      required
      solo
      color="blue-grey darken-3"
      rows="2"
    ></v-textarea>
    <v-row class="mx-0">
      <v-btn color="blue-grey darken-2 white--text mr-2" @click="toggleEditing(false)" small>Cancel</v-btn>
      <v-btn color="deep-purple accent-3 white--text" small type="submit">Save</v-btn>
    </v-row>
  </v-form>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "EditImage",
  props: ["imageId", "toggleEditing", "oldDescription", "updateDescription"],
  data() {
    return {
      description: this.oldDescription
    };
  },
  methods: {
    ...mapActions(["editImage"]),
    editImageId() {
      this.editImage({
        description: this.description,
        imageId: this.imageId,
        toggleEditing: this.toggleEditing,
        updateDescription: this.updateDescription
      });
    }
  }
};
</script>

<style>
</style>