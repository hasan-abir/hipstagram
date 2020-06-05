<template>
  <div class="blue-grey darken-4" style="min-height: 100vh; padding-top: 150px;">
    <div class="my-container px-4">
      <Navbar :dashboard="true" :profile="false" />
      <UploadImage />
      <Images :loading="dataLoading" :images="filteredImages" />
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar";
import UploadImage from "../components/UploadImage";
import Images from "../components/Images";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Dashboard",
  components: {
    Navbar,
    UploadImage,
    Images
  },
  computed: mapGetters(["dataLoading", "filteredImages"]),
  mounted() {
    new Promise((resolve, reject) => {
      resolve(this.verifyUser());
    }).then(() => {
      this.fetchFeed();
    });
  },
  methods: {
    ...mapActions(["verifyUser", "fetchFeed"])
  }
};
</script>

<style>
</style>