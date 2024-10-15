<script setup>
import { ref } from "vue";
import ImageEdit from "@/components/ImageEdit.vue";
import imageController from "@/controllers/imageController";
import { store } from "@/store";

const emit = defineEmits(["image-delete"]);

const props = defineProps({
  image: Object,
  isHovering: Boolean,
  props: Object,
  editable: Boolean,
});

const error = ref(null);
const loading = ref(false);

const deleteImage = async () => {
  try {
    error.value = null;
    loading.value = true;

    await imageController.removeImage(store.auth.token, props.image._id);

    emit("image-delete");
  } catch (err) {
    error.value = {
      body: err.response ? err.response.data : null,
      statusCode: err.response ? err.response.status : null,
    };

    loading.value = false;
  }
};
</script>

<template>
  <div>
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
    <template v-if="editable">
      <ImageEdit
        v-if="editable"
        :imageId="props.image._id"
        :caption="props.image.caption"
      />
      <v-alert
        v-if="error && error.body && error.body.msg"
        prominent
        type="error"
        density="compact"
        variant="text"
        :icon="false"
        transition="fade-transition"
        class="font-weight-bold mb-4"
        >{{ error.body.msg }}</v-alert
      >
      <v-btn
        color="error"
        block
        variant="tonal"
        dark
        type="submit"
        class="mt-4"
        :disabled="loading"
        @click="deleteImage()"
      >
        Delete
      </v-btn>
    </template>
  </div>
</template>
