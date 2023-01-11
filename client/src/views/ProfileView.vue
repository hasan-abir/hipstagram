<script setup>
import UserProfile from "@/components/UserProfile.vue";
import { store } from "@/store";
</script>

<template>
  <section class="pt-16">
    <UserProfile :user="store.auth.user" />
  </section>
</template>
