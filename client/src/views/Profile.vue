<template>
  <div class="blue-grey darken-4" style="min-height: 100vh; padding-top: 150px;">
    <div class="my-container px-4">
      <Navbar :dashboard="false" :profile="true" />
      <v-row v-if="loading" justify="center">
        <v-progress-circular :size="70" :width="7" color="deep-purple accent-2" indeterminate></v-progress-circular>
      </v-row>
      <div v-else>
        <v-row
          class="mx-0"
          align="center"
          justify="center"
          :class="{'flex-column': $vuetify.breakpoint.xsOnly}"
        >
          <v-avatar size="150" aspect-ratio="1">
            <img :src="avatar.url" :alt="username" style="object-fit:cover;" />
          </v-avatar>
          <div :class="{'ml-8': $vuetify.breakpoint.smAndUp, 'mt-8': $vuetify.breakpoint.xsOnly}">
            <h1 class="white--text">{{username}}</h1>
          </div>
        </v-row>
        <hr class="blue-grey darken-2 my-8" />
        <Images :loading="false" :images="filteredImages" v-if="filteredImages.length > 0" />
        <h1 v-else class="headline white--text text-center">No images uploaded yet.</h1>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar";
import { mapActions, mapGetters } from "vuex";
import Images from "../components/Images";

export default {
  name: "Profile",
  data() {
    return {
      loading: true,
      username: "",
      avatar: {}
    };
  },
  computed: mapGetters([
    "filteredImages",
    "currentUsername",
    "currentUseravatar"
  ]),
  components: {
    Navbar,
    Images
  },
  mounted() {
    new Promise((resolve, reject) => {
      resolve(this.verifyUser());
    }).then(() => {
      (this.username = this.currentUsername),
        (this.avatar = this.currentUseravatar);
      this.getCurrentUserImages({
        toggleLoading: this.toggleLoading
      });
    });
  },
  methods: {
    ...mapActions(["verifyUser", "getCurrentUserImages"]),
    toggleLoading(value) {
      this.loading = value;
    }
  }
};
</script>

<style>
</style>