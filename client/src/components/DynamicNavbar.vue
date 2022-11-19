<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { store } from "@/store";

const drawer = ref(null);
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    class="d-flex d-sm-none"
    temporary
    location="right"
    color="background"
  >
    <v-divider></v-divider>

    <v-list density="compact" nav :disabled="store.auth.loading">
      <template v-if="store.auth.user">
        <v-list-item
          :prepend-avatar="store.auth.user.avatar.url"
          :title="store.auth.user.username"
        ></v-list-item>
        <v-list-item
          to="/dashboard"
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="dashboard"
        ></v-list-item>
        <v-list-item
          to="/profile"
          prepend-icon="mdi-account"
          title="Profile"
          value="profile"
        ></v-list-item>
      </template>
      <template v-else>
        <v-list-item to="/login" title="Login" value="login"></v-list-item>
        <v-list-item
          to="/register"
          title="Register"
          value="register"
        ></v-list-item>
      </template>
    </v-list>
    <template v-slot:append v-if="store.auth.user">
      <div class="pa-2">
        <v-btn
          block
          color="primary"
          :disabled="store.auth.loading"
          @click="
            () => {
              store.logout();
              drawer = false;
            }
          "
        >
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>

  <v-app-bar fixed color="background" :elevation="0">
    <template v-slot:prepend>
      <RouterLink to="/">
        <v-img max-height="30" width="30" src="/logo.svg"></v-img>
      </RouterLink>
    </template>

    <v-app-bar-title class="font-weight-bold">Hipstagram</v-app-bar-title>

    <v-spacer></v-spacer>
    <v-toolbar-items class="d-none d-sm-flex">
      <template v-if="store.auth.user">
        <v-btn to="/dashboard" :disabled="store.auth.loading">dashboard</v-btn>
        <v-btn to="/profile" :disabled="store.auth.loading"
          ><v-icon class="mr-4">mdi-account</v-icon> profile</v-btn
        >
        <v-btn @click="store.logout()" :disabled="store.auth.loading"
          >logout</v-btn
        >
      </template>
      <template v-else>
        <v-btn to="/login" :disabled="store.auth.loading">login</v-btn>
        <v-btn to="/register" :disabled="store.auth.loading">register</v-btn>
      </template>
    </v-toolbar-items>
    <v-btn icon class="d-block d-sm-none" @click="drawer = !drawer"
      ><v-icon>mdi-menu</v-icon></v-btn
    >
  </v-app-bar>
</template>
