<template>
  <div class="image">
    <v-img :src="image.image.url" aspect-ratio="1"></v-img>
    <div
      class="overlay d-flex align-center justify-center"
      style="cursor: pointer;"
      @click="toggleModal(true)"
    >
      <span class="white--text font-weight-bold headline mr-2">{{image.likes}}</span>
      <v-icon class="white--text" large>mdi-heart</v-icon>
    </div>
    <ViewImage :toggleModal="toggleModal" :image="image" v-if="modal" />
  </div>
</template>

<script>
import ViewImage from "./ViewImage";

export default {
  name: "SingleImage",
  components: {
    ViewImage
  },
  props: ["image"],
  data() {
    return {
      modal: false
    };
  },
  methods: {
    toggleModal(value) {
      this.modal = value;
    }
  }
};
</script>

<style scoped>
.image {
  position: relative;
}
.image:hover .overlay {
  opacity: 1;
}
.overlay {
  opacity: 0;
  transition: opacity 0.2s;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
</style>