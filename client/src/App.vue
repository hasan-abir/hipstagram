<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: "App"
};
</script>
<style>
.my-container {
  width: 80%;
  margin: 0 auto;
}

@media (max-width: 600px) {
  .my-container {
    width: 95%;
  }
}
</style>
