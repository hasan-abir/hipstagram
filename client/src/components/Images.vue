<template>
  <div>
    <v-row class="mx-0" justify="center" v-if="loading">
      <v-progress-circular :size="70" :width="7" color="deep-purple accent-2" indeterminate></v-progress-circular>
    </v-row>
    <div v-else class="grid">
      <SingleImage v-for="image in images" :image="image" :key="image._id" />
    </div>
  </div>
</template>

<script>
import SingleImage from "./SingleImage";

export default {
  name: "Images",
  components: {
    SingleImage
  },
  props: ["loading", "images"]
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;
  padding-bottom: 1rem;
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>