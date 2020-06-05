<template>
  <v-app-bar color="blue-grey darken-4 " dark fixed :elevation="0" :height="120">
    <v-toolbar-title>
      <router-link to="/" style="text-decoration: none;" class="white--text">
        <v-row align="center" class="mx-0">
          <img src="../assets/logo.svg" alt="logo" width="30" class="mr-3" />
          <h1 class="subtitle-1 font-weight-bold" :hidden="$vuetify.breakpoint.xsOnly">HIPSTAGRAM</h1>
        </v-row>
      </router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <template v-if="!verifyingUser">
      <template v-if="isLoggedIn">
        <v-menu transition="slide-y-transition" bottom left dark>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" class="blue-grey darken-3">
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </template>

          <v-list class="blue-grey darken-3">
            <v-list-item v-if="!dashboard" to="/dashboard">
              <v-list-item-title>
                <v-row justify="space-between" class="mx-0">
                  Dashboard
                  <v-icon class="ml-4">mdi-view-dashboard</v-icon>
                </v-row>
              </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="!profile" to="/profile">
              <v-list-item-title>
                <v-row justify="space-between" class="mx-0">
                  Profile
                  <v-icon class="ml-4">mdi-account</v-icon>
                </v-row>
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>
                <v-row justify="space-between" class="mx-0">
                  Log Out
                  <v-icon class="ml-4">mdi-logout</v-icon>
                </v-row>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-else>
        <v-btn text class="mr-2" to="/login">Login</v-btn>
        <v-btn text to="/signup">Sign Up</v-btn>
      </template>
    </template>
  </v-app-bar>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Navbar",
  props: ["dashboard", "profile"],
  computed: {
    ...mapGetters(["verifyingUser", "isLoggedIn"])
  },
  methods: {
    ...mapActions(["logout"])
  }
};
</script>

<style>
div.v-toolbar__content {
  width: 80%;
  margin: 0 auto;
}

@media (max-width: 600px) {
  div.v-toolbar__content {
    width: 95%;
  }
}
</style>
