<template>
  <div class="blue-grey darken-4" style="min-height: 100vh; padding-top: 150px;">
    <Navbar :dashboard="false" :profile="false" />
    <div class="my-container px-4">
      <h2
        class="white--text font-weight-bold"
        :class="{'display-1 mb-4':$vuetify.breakpoint.xsOnly}"
      >Here are the latest pictures uploaded by users!</h2>
      <p class="white--text mb-12">To upload yours, you need to be logged in.</p>
      <Images :loading="dataLoading" :images="filteredImages" />
    </div>
  </div>
</template> 

<script>
import Navbar from "../components/Navbar";
import Images from "../components/Images";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Home",
  components: {
    Navbar,
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
