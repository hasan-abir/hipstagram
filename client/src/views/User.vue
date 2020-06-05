<template>
  <div class="blue-grey darken-4" style="min-height: 100vh; padding-top: 150px;">
    <div class="my-container px-4">
      <Navbar :dashboard="false" :profile="false" />
      <v-row v-if="loading" justify="center">
        <v-progress-circular :size="70" :width="7" color="deep-purple accent-2" indeterminate></v-progress-circular>
      </v-row>
      <div v-else>
        <h1
          v-if="noUser"
          class="display-1 blue-grey--text text-center pt-8"
        >User doesn't exist with the id of "{{$route.params.id}}"</h1>
        <template v-else>
          <v-row
            class="mx-0"
            align="center"
            justify="center"
            :class="{'flex-column': $vuetify.breakpoint.xsOnly}"
          >
            <v-avatar size="150">
              <img :src="avatar.url" :alt="username" style="object-fit:cover;" />
            </v-avatar>
            <div :class="{'ml-8': $vuetify.breakpoint.smAndUp, 'mt-8': $vuetify.breakpoint.xsOnly}">
              <h1 class="white--text mb-4">{{username}}</h1>
            </div>
          </v-row>
          <hr class="blue-grey darken-2 my-8" />
          <Images :loading="false" :images="filteredImages" v-if="filteredImages.length > 0" />
          <h1 v-else class="headline white--text text-center">No images uploaded yet.</h1>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar";
import { mapActions, mapGetters } from "vuex";
import Images from "../components/Images";

export default {
  name: "User",
  data() {
    return {
      loading: true,
      noUser: false,
      username: "",
      avatar: {}
    };
  },
  computed: mapGetters(["filteredImages", "allUsers", "currentUserId"]),
  components: {
    Navbar,
    Images
  },
  mounted() {
    new Promise((resolve, reject) => {
      resolve(this.verifyUser());
    }).then(() => {
      this.getAllUsers({
        toggleLoading: this.toggleLoading,
        userId: this.$route.params.id,
        setData: this.setData,
        toggleNoUser: this.toggleNoUser
      });
    });
  },
  methods: {
    ...mapActions(["getAllUsers", "verifyUser"]),
    toggleLoading(value) {
      this.loading = value;
    },
    toggleNoUser(value) {
      this.noUser = value;
    },
    setData({ username, avatar }) {
      this.username = username;
      this.avatar = avatar;
    }
  }
};
</script>

<style>
</style>