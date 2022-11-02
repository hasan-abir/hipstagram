const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const { before, beforeEach, afterEach, after } = require("mocha");
chai.use(chaiHttp);
const dotenv = require("dotenv");
const dbHandler = require("../../db-handler");
const app = require("../../../server");
const { jwtGenerateToken } = require("../../../jwt_utils");
const Image = require("../../../models/Image");
const Like = require("../../../models/Like");
const Comment = require("../../../models/Comment");
const User = require("../../../models/User");

describe("FeedbackController", () => {
  before(async () => {
    dotenv.config();
    await dbHandler.connect();
  });
  beforeEach(async () => {
    const demoAuthor = new User({
      avatar: {
        url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
        fileId: "male",
      },
      username: "Hasan Abir",
      gender: "male",
      email: "hasanabir@test.com",
      password: "testtest",
    });
    const demoUser = new User({
      avatar: {
        url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
        fileId: "male",
      },
      username: "John Doe",
      gender: "male",
      email: "johndoe@test.com",
      password: "testtest",
    });
    await demoAuthor.save();
    await demoUser.save();
    const demoImage = new Image({
      file: {
        url: "url",
        fileId: "fileId",
      },
      author: demoAuthor,
      caption: "example",
    });
    await demoImage.save();
  });
  afterEach(async () => {
    await dbHandler.clearDatabase();
  });
  after(async () => {
    await dbHandler.closeDatabase();
  });

  describe("POST: /api/feedback/like/image/:imageId", () => {
    it("should like an image", async () => {
      // given
      const image = await Image.findOne({ caption: "example" });
      const user = await User.findOne({ username: "John Doe" });

      const token = await jwtGenerateToken(user);

      // when
      const res = await chai
        .request(app)
        .post("/api/feedback/like/image/" + image._id)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token);
      // then
      expect(res).to.have.status(200);
      expect(res.body.likesCount).to.equal(1);
      expect(res.body.isLiked).to.equal(true);

      const likePosted = await Like.exists({
        image: image._id,
        author: user._id,
      });
      expect(likePosted.hasOwnProperty("_id")).to.equal(true);
    });
    it("should return error when image is not ObjectId type", async () => {
      // given
      const imageId = "123";
      const user = await User.findOne({ username: "John Doe" });

      const token = await jwtGenerateToken(user);

      // when
      const res = await chai
        .request(app)
        .post("/api/feedback/like/image/" + imageId)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token);
      // then
      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("Image not found");
    });
    it("should return error when image not found", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";
      const user = await User.findOne({ username: "John Doe" });

      const token = await jwtGenerateToken(user);

      // when
      const res = await chai
        .request(app)
        .post("/api/feedback/like/image/" + imageId)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token);
      // then
      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("Image not found");
    });
    it("should return error when image is already liked", async () => {
      // given
      const image = await Image.findOne({ caption: "example" });
      const user = await User.findOne({ username: "John Doe" });

      await new Like({
        author: user,
        image,
      }).save();

      const token = await jwtGenerateToken(user);

      // when
      const res = await chai
        .request(app)
        .post("/api/feedback/like/image/" + image._id)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token);
      // then
      expect(res).to.have.status(400);
      expect(res.body.msg).to.equal("Image already liked");
    });
  });
  describe("DELETE: /api/feedback/unlike/image/:imageId", () => {
    it("should unlike an image", async () => {
      // given
      const image = await Image.findOne({ caption: "example" });
      const user = await User.findOne({ username: "John Doe" });
      await new Like({
        author: user,
        image,
      }).save();
      const token = await jwtGenerateToken(user);

      // when
      const res = await chai
        .request(app)
        .delete("/api/feedback/unlike/image/" + image._id)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token);
      // then
      expect(res).to.have.status(200);
      expect(res.body.likesCount).to.equal(0);
      expect(res.body.isLiked).to.equal(false);

      const likePosted = await Like.exists({
        image: image._id,
        author: user._id,
      });
      expect(likePosted).to.be.null;
    });
    it("should return error when image is not ObjectId Type", async () => {
      // given
      const imageId = "123";
      const user = await User.findOne({ username: "John Doe" });

      const token = await jwtGenerateToken(user);

      // when
      const res = await chai
        .request(app)
        .delete("/api/feedback/unlike/image/" + imageId)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token);
      // then
      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("Image not found");
    });
    it("should return error when image not found", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";
      const user = await User.findOne({ username: "John Doe" });

      const token = await jwtGenerateToken(user);

      // when
      const res = await chai
        .request(app)
        .delete("/api/feedback/unlike/image/" + imageId)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token);
      // then
      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("Image not found");
    });
    it("should return error when image is not liked", async () => {
      // given
      const image = await Image.findOne({ caption: "example" });
      const user = await User.findOne({ username: "John Doe" });

      const token = await jwtGenerateToken(user);

      // when
      const res = await chai
        .request(app)
        .delete("/api/feedback/unlike/image/" + image._id)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token);
      // then
      expect(res).to.have.status(400);
      expect(res.body.msg).to.equal("Image not liked");
    });
  });
  describe("GET: /api/feedback/likes/image/:imageId", () => {
    it("should get like counter", async () => {
      // given
      const image = await Image.findOne({ caption: "example" });
      const imageAuthor = await User.findOne({ username: "Hasan Abir" });
      const user = await User.findOne({ username: "John Doe" });

      await new Like({
        author: user,
        image,
      }).save();
      await new Like({
        author: imageAuthor,
        image,
      }).save();

      // when
      const res = await chai
        .request(app)
        .get("/api/feedback/likes/image/" + image._id)
        .set("x-api-key", process.env.API_KEY);
      // then
      expect(res).to.have.status(200);
      expect(res.body.likesCount).to.equal(2);
      expect(res.body.isLiked).to.equal(false);
    });
    it("should get like counter and isLikedValue (with auth)", async () => {
      // given
      const image = await Image.findOne({ caption: "example" });
      const imageAuthor = await User.findOne({ username: "Hasan Abir" });
      const user = await User.findOne({ username: "John Doe" });

      await new Like({
        author: user,
        image,
      }).save();
      await new Like({
        author: imageAuthor,
        image,
      }).save();

      const token = await jwtGenerateToken(user);

      // when
      const res = await chai
        .request(app)
        .get("/api/feedback/likes/image/" + image._id)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token);
      // then
      expect(res).to.have.status(200);
      expect(res.body.likesCount).to.equal(2);
      expect(res.body.isLiked).to.equal(true);
    });
    it("should return error when image is not ObjectId type", async () => {
      // given
      const imageId = "123";

      // when
      const res = await chai
        .request(app)
        .get("/api/feedback/likes/image/" + imageId)
        .set("x-api-key", process.env.API_KEY);
      // then
      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("Image not found");
    });
    it("should return error when image not found", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";

      // when
      const res = await chai
        .request(app)
        .get("/api/feedback/likes/image/" + imageId)
        .set("x-api-key", process.env.API_KEY);
      // then
      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("Image not found");
    });
  });
  describe("POST: /api/feedback/comment/image/:imageId", () => {
    it("should post comment on image", async () => {
      // given
      const reqBody = { text: "Lorem ipsum" };
      const image = await Image.findOne({ caption: "example" });
      const user = await User.findOne({ username: "John Doe" });

      const token = await jwtGenerateToken(user);

      // when
      const res = await chai
        .request(app)
        .post("/api/feedback/comment/image/" + image._id)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token)
        .send(reqBody);

      // then
      expect(res).to.have.status(200);
      expect(res.body.text).to.equal(reqBody.text);
      expect(res.body.author.username).to.equal(user.username);
      expect(res.body.author.avatar.fileId).to.equal(user.avatar.fileId);
      expect(res.body.author.hasOwnProperty("_id")).to.equal(false);
      expect(res.body.hasOwnProperty("image")).to.equal(false);

      const commentPosted = await Comment.exists({
        image: image._id,
        author: user._id,
      });

      expect(commentPosted.hasOwnProperty("_id")).to.equal(true);
    });
    it("should return error when imageId is not ObjectId type", async () => {
      // given
      const imageId = "123";
      const user = await User.findOne({ username: "John Doe" });

      const token = await jwtGenerateToken(user);

      // when
      const res = await chai
        .request(app)
        .post("/api/feedback/comment/image/" + imageId)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token);

      // then
      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("Image not found");
    });
    it("should return error when image is not found", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";
      const user = await User.findOne({ username: "John Doe" });

      const token = await jwtGenerateToken(user);

      // when
      const res = await chai
        .request(app)
        .post("/api/feedback/comment/image/" + imageId)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token);

      // then
      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("Image not found");
    });
  });
  describe("DELETE: /api/feedback/comment/:commentId", () => {
    it("should remove comment from image", async () => {
      // given
      const image = await Image.findOne({ caption: "example" });
      const user = await User.findOne({ username: "John Doe" });

      const newComment = new Comment({
        text: "Lorem Ipsum",
        image,
        author: user,
      });

      await newComment.save();

      const token = await jwtGenerateToken(user);
      // when
      const res = await chai
        .request(app)
        .delete("/api/feedback/comment/" + newComment._id)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token);
      // then
      expect(res).to.have.status(200);
      const commentPosted = await Comment.exists({
        image: image._id,
        author: user._id,
      });

      expect(commentPosted).to.be.null;
    });
    it("should return error when user is not the author", async () => {
      // given
      const image = await Image.findOne({ caption: "example" });
      const user = await User.findOne({ username: "John Doe" });
      const author = await User.findOne({ username: "Hasan Abir" });

      const newComment = new Comment({
        text: "Lorem Ipsum",
        image,
        author,
      });

      await newComment.save();

      const token = await jwtGenerateToken(user);
      // when
      const res = await chai
        .request(app)
        .delete("/api/feedback/comment/" + newComment._id)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token);
      // then
      expect(res).to.have.status(400);
      expect(res.body.msg).to.equal("User doesn't have the permission");
    });
    it("should return error when commentId is not ObjectIdType", async () => {
      // given
      const commentId = "123";
      const user = await User.findOne({ username: "John Doe" });

      const token = await jwtGenerateToken(user);

      // when
      const res = await chai
        .request(app)
        .delete("/api/feedback/comment/" + commentId)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token);

      // then
      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("Comment not found");
    });
    it("should return error when comment is not found", async () => {
      // given
      const commentId = "6333f15d5472f567374519d4";
      const user = await User.findOne({ username: "John Doe" });

      const token = await jwtGenerateToken(user);

      // when
      const res = await chai
        .request(app)
        .delete("/api/feedback/comment/" + commentId)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token);

      // then
      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("Comment not found");
    });
  });
  describe("GET: /api/feedback/comments/image/:imageId", () => {
    it("should get comments", async () => {
      // given
      const limit = 2;
      const image = await Image.findOne({ caption: "example" });
      const author = await User.findOne({ username: "Hasan Abir" });

      const commentBody = {
        author,
        image,
      };

      let newCommentA = new Comment({ text: "A", ...commentBody });
      let newCommentB = new Comment({ text: "B", ...commentBody });
      let newCommentC = new Comment({ text: "C", ...commentBody });
      let newCommentD = new Comment({ text: "D", ...commentBody });
      newCommentA = await newCommentA.save();
      newCommentB = await newCommentB.save();
      newCommentC = await newCommentC.save();
      newCommentD = await newCommentD.save();

      // when
      const res = await chai
        .request(app)
        .get("/api/feedback/comments/image/" + image._id)
        .query({ limit })
        .set("x-api-key", process.env.API_KEY);
      // then
      expect(res).to.have.status(200);
      expect(res.body.next).to.equal(newCommentC.updatedAt.toISOString());
      expect(res.body.comments[0].text).to.equal(newCommentD.text);
      expect(res.body.comments[1].text).to.equal(newCommentC.text);
      expect(res.body.comments[0].author.username).to.equal(author.username);
      expect(res.body.comments[0].author.avatar.fileId).to.equal(
        author.avatar.fileId
      );
      expect(res.body.comments[0].author.hasOwnProperty("_id")).to.equal(false);
      expect(res.body.comments[0].hasOwnProperty("image")).to.equal(false);
    });
    it("should return empty comments", async () => {
      // given
      const image = await Image.findOne({ caption: "example" });

      // when
      const res = await chai
        .request(app)
        .get("/api/feedback/comments/image/" + image._id)
        .set("x-api-key", process.env.API_KEY);
      // then
      expect(res).to.have.status(200);
      expect(res.body.comments).to.be.an("array").that.is.empty;
      expect(res.body.next).to.equal(false);
    });
    it("should get next batch of comments", async () => {
      // given
      const limit = 2;
      const image = await Image.findOne({ caption: "example" });
      const author = await User.findOne({ username: "Hasan Abir" });

      const commentBody = {
        author,
        image,
      };

      let newCommentA = new Comment({ text: "A", ...commentBody });
      let newCommentB = new Comment({ text: "B", ...commentBody });
      let newCommentC = new Comment({ text: "C", ...commentBody });
      let newCommentD = new Comment({ text: "D", ...commentBody });
      newCommentA = await newCommentA.save();
      newCommentB = await newCommentB.save();
      newCommentC = await newCommentC.save();
      newCommentD = await newCommentD.save();

      const lastItemTimestamp = newCommentC.updatedAt;
      // when
      const res = await chai
        .request(app)
        .get("/api/feedback/comments/image/" + image._id)
        .query({ limit, next: lastItemTimestamp })
        .set("x-api-key", process.env.API_KEY);
      // then
      expect(res).to.have.status(200);
      expect(res.body.next).to.equal(newCommentA.updatedAt.toISOString());
      expect(res.body.comments[0].text).to.equal(newCommentB.text);
      expect(res.body.comments[1].text).to.equal(newCommentA.text);
      expect(res.body.comments[0].author.username).to.equal(author.username);
      expect(res.body.comments[0].author.avatar.fileId).to.equal(
        author.avatar.fileId
      );
      expect(res.body.comments[0].author.hasOwnProperty("_id")).to.equal(false);
      expect(res.body.comments[0].hasOwnProperty("image")).to.equal(false);
    });
    it("should return error when imageId is not ObjectIdType", async () => {
      // given
      const imageId = "123";
      const user = await User.findOne({ username: "John Doe" });

      const token = await jwtGenerateToken(user);

      // when
      const res = await chai
        .request(app)
        .get("/api/feedback/comments/image/" + imageId)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token);

      // then
      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("Image not found");
    });
    it("should return error when image is not found", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";
      const user = await User.findOne({ username: "John Doe" });

      const token = await jwtGenerateToken(user);

      // when
      const res = await chai
        .request(app)
        .get("/api/feedback/comments/image/" + imageId)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token);

      // then
      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("Image not found");
    });
  });
});
