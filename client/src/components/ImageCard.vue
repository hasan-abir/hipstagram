<script setup>
const componentProps = defineProps({
  image: Object,
});
</script>

<template>
  <v-hover >
    <template v-slot:default="{ isHovering, props }">
    <v-card v-bind="props">
      <v-img
        :src="componentProps.image.file.url + '?tr=ar-1-1,w-400'"
        :lazy-src="componentProps.image.file.url + '?tr=ar-1-1,w-16'"
        :alt="componentProps.image.caption"
        aspect-ratio="1"
        cover
      >
      </v-img>
      <v-overlay
        :model-value="isHovering"
        :close-on-content="false"
        contained
        scrim="#000000"
        class="align-center justify-center"
      >
        <v-btn
          :to="'/image/' + componentProps.image._id"
          variant="text"
          icon="mdi-magnify-plus-outline"
        ></v-btn>
      </v-overlay>
    </v-card>
  </template>
  </v-hover>
</template>
