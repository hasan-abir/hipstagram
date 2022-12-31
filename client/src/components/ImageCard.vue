<script setup>
const props = defineProps({
  image: Object,
  isHovering: Boolean,
  props: Object,
});
</script>

<template>
  <v-card v-bind="props.props">
    <v-img
      :src="props.image.file.url + '?tr=ar-1-1,w-400'"
      :lazy-src="props.image.file.url + '?tr=ar-1-1,w-16'"
      :alt="props.image.caption"
      aspect-ratio="1"
      cover
    >
    </v-img>
    <v-overlay
      :model-value="props.isHovering"
      :close-on-content="false"
      contained
      scrim="#000000"
      class="align-center justify-center"
    >
      <v-btn
        :to="'/image/' + props.image._id"
        variant="text"
        icon="mdi-magnify-plus-outline"
      ></v-btn>
    </v-overlay>
  </v-card>
</template>
