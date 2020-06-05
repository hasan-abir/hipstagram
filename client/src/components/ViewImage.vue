<template>
  <div class="modal-container">
    <div class="modal-closer" @click="toggleModal(false)"></div>
    <div class="my-container px-4">
      <v-row class="mx-0" :class="{'flex-column': $vuetify.breakpoint.xsOnly}">
        <v-col cols="12" sm="8" md="8" lg="8" class="black px-0 py-0">
          <v-img
            :src="image.image.url"
            contain
            :class="{'image-mobile': $vuetify.breakpoint.xsOnly, 'image':$vuetify.breakpoint.smAndUp}"
          ></v-img>
        </v-col>
        <v-col
          cols="12"
          sm="4"
          md="4"
          lg="4"
          class="white px-6 py-6"
          style="height: 600px; overflow-y: scroll;"
        >
          <v-row class="mx-0 mb-4" justify="end" v-if="author">
            <v-btn icon class="red lighten-1 white--text" @click="toggleConfirmDelete(true)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <ConfirmDeleteImage
              :toggleConfirmDelete="toggleConfirmDelete"
              :toggleModal="toggleModal"
              :imageId="image._id"
              v-if="confirmDelete"
            />
            <v-btn
              v-if="!editing"
              icon
              class="blue-grey darken-2 white--text ml-4"
              @click="toggleEditing(true)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-row>
          <h1 class="headline font-weight-bold" v-if="author">
            <router-link
              to="/profile"
              style="cursor: pointer; text-decoration: none; color: #000;"
            >{{image.username}}</router-link>
          </h1>
          <h1 class="headline font-weight-bold" v-else>
            <router-link
              :to="'/user/'+image.userId"
              style="cursor: pointer; text-decoration: none; color: #000;"
            >{{image.username}}</router-link>
          </h1>
          <p class="subtitle grey--text">Uploaded {{uploadTime}} ago</p>
          <EditImage
            v-if="editing"
            :toggleEditing="toggleEditing"
            :imageId="image._id"
            :oldDescription="image.description"
            :updateDescription="updateDescription"
          />
          <p v-else class="subtitle-1">{{description}}</p>
          <div class="mb-4">
            <span class="mr-2">{{likes}}</span>
            <v-btn
              v-if="liked"
              icon
              text
              color="deep-purple accent-3 white--text"
              @click="removeLikeEvent"
              :disabled="likeDisabled"
            >
              <v-icon>mdi-heart</v-icon>
            </v-btn>
            <v-btn
              v-else
              icon
              text
              color="deep-purple accent-3 white--text"
              @click="likeEvent"
              :disabled="likeDisabled"
            >
              <v-icon>mdi-heart-outline</v-icon>
            </v-btn>
          </div>
          <v-form class="mb-8" @submit.prevent="commentEvent">
            <v-textarea
              v-model="commentInput"
              label="Comment"
              required
              filled
              color="blue-grey darken-3"
              rows="2"
            ></v-textarea>
            <v-btn
              block
              color="deep-purple accent-3 white--text"
              type="submit"
              :disabled="commentDisabled"
            >Comment</v-btn>
          </v-form>
          <div v-if="comments.length > 0">
            <div
              class="grey lighten-4 px-4 py-4 mt-4"
              v-for="(comment, index) in comments"
              :key="index"
            >
              <p class="font-weight-bold mb-1">{{comment.username}}</p>
              <p class="body-2">{{comment.commentTxt}}</p>
            </div>
          </div>
          <div v-else>
            <p class="mb-0 text-center grey--text">Be the first to comment!</p>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ConfirmDeleteImage from "./ConfirmDeleteImage";
import EditImage from "./EditImage";

export default {
  name: "ViewImage",
  components: {
    ConfirmDeleteImage,
    EditImage
  },
  props: ["toggleModal", "image"],
  data() {
    return {
      uploadTime: "",
      author: false,
      liked: false,
      likes: this.image.likes,
      likeDisabled: false,
      commentInput: "",
      comments: [],
      commentDisabled: false,
      commentError: "",
      confirmDelete: false,
      editing: false,
      description: this.image.description
    };
  },
  computed: mapGetters([
    "currentUserId",
    "currentUsername",
    "userLikes",
    "allComments"
  ]),
  mounted() {
    if (this.image.userId === this.currentUserId) {
      this.author = true;
    }

    const foundLike = this.userLikes.filter(like => {
      return (
        like.userId === this.currentUserId && like.imageId === this.image._id
      );
    });

    if (foundLike.length > 0) {
      this.toggleLiked(true);
    }

    const foundComments = this.allComments.filter(comment => {
      return comment.imageId === this.image._id;
    });

    this.comments = foundComments.sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );

    this.setUploadTime();
  },
  methods: {
    ...mapActions(["likeImage", "removeLikeImage", "commentOnImage"]),
    toggleConfirmDelete(value) {
      this.confirmDelete = value;
    },
    toggleEditing(value) {
      this.editing = value;
    },
    updateDescription(value) {
      this.description = value;
    },
    toggleLiked(value) {
      this.liked = value;
    },
    toggleLikes(value) {
      this.likes = value;
    },
    toggleLikeDisabled(value) {
      this.likeDisabled = value;
    },
    likeEvent() {
      this.toggleLikeDisabled(true);
      this.toggleLiked(true);
      this.toggleLikes(this.likes + 1);

      this.likeImage({
        imageId: this.image._id,
        toggleLikeDisabled: this.toggleLikeDisabled,
        likes: this.likes
      });
    },
    removeLikeEvent() {
      this.toggleLikeDisabled(true);
      this.toggleLiked(false);
      this.toggleLikes(this.likes - 1);

      this.removeLikeImage({
        imageId: this.image._id,
        toggleLikeDisabled: this.toggleLikeDisabled,
        likes: this.likes
      });
    },
    toggleCommentDisabled(value) {
      this.commentDisabled = value;
    },
    clearComment() {
      this.commentInput = "";
    },
    setComment(value) {
      this.comments = [value, ...this.comments];
    },
    commentEvent() {
      if (this.commentInput === "") {
        this.commentError = "Cannot post an empty comment.";
      } else {
        this.toggleCommentDisabled(true);
        this.commentOnImage({
          imageId: this.image._id,
          toggleCommentDisabled: this.toggleCommentDisabled,
          commentTxt: this.commentInput,
          setComment: this.setComment,
          clearComment: this.clearComment
        });
      }
    },
    setUploadTime() {
      const year =
        new Date().getFullYear() - new Date(this.image.created).getFullYear();
      const month =
        new Date().getMonth() +
        1 -
        (new Date(this.image.created).getMonth() + 1);
      const date =
        new Date().getDate() - new Date(this.image.created).getDate();
      const hour =
        new Date().getHours() - new Date(this.image.created).getHours();
      const min =
        new Date().getMinutes() - new Date(this.image.created).getMinutes();
      const sec =
        new Date().getSeconds() - new Date(this.image.created).getSeconds();

      if (year > 0) {
        if (year === 1) {
          this.uploadTime = "1 year";
        } else {
          this.uploadTime = `${year} years`;
        }
      } else if (month > 0) {
        if (month === 1) {
          this.uploadTime = "1 month";
        } else {
          this.uploadTime = `${month} months`;
        }
      } else if (date > 0) {
        if (date === 1) {
          this.uploadTime = "1 day";
        } else {
          this.uploadTime = `${date} days`;
        }
      } else if (hour > 0) {
        if (hour === 1) {
          this.uploadTime = "1 hour";
        } else {
          this.uploadTime = `${hour} hours`;
        }
      } else if (min > 0) {
        if (min === 1) {
          this.uploadTime = "1 min";
        } else {
          this.uploadTime = `${min} mins`;
        }
      } else if (sec >= 0) {
        if (sec === 1 || sec === 0) {
          this.uploadTime = `${sec} sec`;
        } else {
          this.uploadTime = `${sec} secs`;
        }
      }
    }
  }
};
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  padding-top: 100px;
  padding-bottom: 100px;
  overflow-y: scroll;
}

.image {
  height: 600px;
}

.image-mobile {
  height: 300px;
}

.modal-closer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
}
</style>