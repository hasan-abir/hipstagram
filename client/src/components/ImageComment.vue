<script setup>
import feedbackController from "@/controllers/feedbackController";
import { store } from "@/store";
import getUploadDate from "@/utils/getUploadDate";
import { onMounted, ref } from "vue";

const props = defineProps({
  imageId: String,
});

const form = ref();
const valid = ref(false);
const disabled = ref(false);
const error = ref(null);
const loading = ref(false);
const newComment = ref("");
const newCommentRules = ref([(v) => !!v || "Comment is required"]);
const comments = ref([]);
const nextComment = ref(null);

const submitComment = async () => {
  if (valid.value) {
    try {
      error.value = null;
      loading.value = true;
      disabled.value = true;

      const data = await feedbackController.commentOnImage(
        store.auth.token,
        props.imageId,
        newComment.value
      );

      comments.value.unshift(data);

      form.reset();
    } catch (err) {
      error.value = {
        body: err.response ? err.response.data : null,
        statusCode: err.response ? err.response.status : null,
      };
    } finally {
      loading.value = false;
      disabled.value = false;
    }
  }
};

const deleteComment = async (commentId) => {
  try {
    error.value = null;
    loading.value = true;

    await feedbackController.removeCommentFromImage(
      store.auth.token,
      commentId
    );

    comments.value = comments.value.filter(
      (comment) => comment._id !== commentId
    );
  } catch (err) {
    error.value = {
      body: err.response ? err.response.data : null,
      statusCode: err.response ? err.response.status : null,
    };
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    loading.value = true;

    const data = await feedbackController.getLatestComments(
      props.imageId,
      10,
      nextComment.value
    );

    comments.value.push(...data.comments);
    nextComment.value = data.next;
  } catch (err) {
    error.value = {
      body: err.response ? err.response.data : null,
      statusCode: err.response ? err.response.status : null,
    };
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <p class="mb-4">Comments</p>
  <v-form
    v-model="valid"
    @submit.prevent="submitComment"
    ref="form"
    class="mb-4"
  >
    <v-textarea
      v-model="newComment"
      :rules="newCommentRules"
      label="Comment"
      required
      variant="outlined"
      color="primary"
      rows="2"
    ></v-textarea>
    <v-btn color="primary" block dark type="submit" :disabled="disabled"
      >Post Comment</v-btn
    >
  </v-form>
  <v-row class="mx-0" justify="center" v-if="loading">
    <v-progress-circular
      indeterminate
      dark
      class="my-2"
      color="primary"
    ></v-progress-circular>
  </v-row>
  <div
    v-else-if="comments.length > 0"
    v-for="comment in comments"
    :key="comment._id"
    class="d-flex mt-2"
  >
    <v-avatar :image="comment.author.avatar.url" class="mr-2 mb-2"></v-avatar>
    <v-card variant="outlined" class="flex-grow-1">
      <v-card-text>
        <div class="d-flex">
          <h4 class="flex-grow-1 mr-1">
            {{ comment.author.username }}
          </h4>
          <p class="text-grey text-caption">
            {{ getUploadDate(comment.createdAt) }}
          </p>
        </div>

        <p class="mt-2">{{ comment.text }}</p>
      </v-card-text>
      <v-card-actions
        v-if="
          store.auth.user &&
          store.auth.user.username === comment.author.username
        "
      >
        <v-btn
          color="error"
          variant="text"
          size="x-small"
          @click="deleteComment(comment._id)"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
  <p class="mt-4 text-center" v-else>No comments ...yet</p>
</template>
