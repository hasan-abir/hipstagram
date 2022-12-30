const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");
const { afterEach } = require("mocha");
const feedbackService = require("../../../services/feedbackService");
const User = require("../../../models/User");
const Image = require("../../../models/Image");
const Like = require("../../../models/Like");
const Comment = require("../../../models/Comment");

describe("FeedbackService", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("#likeImage()", () => {
    it("should like image", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";
      const username = "Hasan Abir";

      const imageFind = sinon
        .stub(Image, "findById")
        .returns(Promise.resolve(new Image()));
      const mockUser = new User();
      const userFind = sinon
        .stub(User, "findOne")
        .returns(Promise.resolve(mockUser));
      const likeExist = sinon
        .stub(Like, "exists")
        .returns(Promise.resolve(null));
      const likeSave = sinon
        .stub(Like.prototype, "save")
        .returns(Promise.resolve(null));
      const likesCount = sinon
        .stub(Like, "countDocuments")
        .returns(Promise.resolve(1));

      // when
      const result = await feedbackService.likeImage(imageId, username);
      // then
      expect(result.likesCount).to.equal(1);
      expect(result.isLiked).to.equal(true);
      expect(imageFind.calledWith(imageId)).to.equal(true);
      expect(userFind.calledWith({ username })).to.equal(true);
      expect(
        likeExist.calledWith({ image: imageId, author: mockUser._id })
      ).to.equal(true);
      expect(likeExist.calledOnce).to.equal(true);
      expect(likeSave.calledOnce).to.equal(true);
      expect(likesCount.calledWith({ image: imageId })).to.equal(true);
    });
    it("should throw when imageId is not ObjectId type", async () => {
      // given
      const imageId = "123";
      const username = "Hasan Abir";

      sinon.stub(Image, "findById").returns(Promise.resolve(null));

      // then
      await expect(
        feedbackService.likeImage(imageId, username)
      ).to.be.rejectedWith("Image not found");
    });
    it("should throw when image is not found", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";
      const username = "Hasan Abir";

      sinon.stub(Image, "findById").returns(Promise.resolve(null));

      // then
      await expect(
        feedbackService.likeImage(imageId, username)
      ).to.be.rejectedWith("Image not found");
    });
    it("should throw when image already liked", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";
      const username = "Hasan Abir";

      sinon.stub(Image, "findById").returns(Promise.resolve(new Image()));
      const mockUser = new User();
      sinon.stub(User, "findOne").returns(Promise.resolve(mockUser));
      sinon.stub(Like, "exists").returns(Promise.resolve(true));

      // then
      await expect(
        feedbackService.likeImage(imageId, username)
      ).to.be.rejectedWith("Image already liked");
    });
  });
  describe("#unlikeImage()", () => {
    it("should unlike image", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";
      const username = "Hasan Abir";

      const imageFind = sinon
        .stub(Image, "findById")
        .returns(Promise.resolve(new Image()));
      const mockUser = new User();
      const userFind = sinon
        .stub(User, "findOne")
        .returns(Promise.resolve(mockUser));
      const likeFind = sinon
        .stub(Like, "findOne")
        .returns(Promise.resolve(new Like()));
      const likeExist = sinon.stub(Like, "exists");
      const likeRemove = sinon
        .stub(Like.prototype, "remove")
        .returns(Promise.resolve(null));
      const likesCount = sinon
        .stub(Like, "countDocuments")
        .returns(Promise.resolve(0));

      // when
      const result = await feedbackService.unlikeImage(imageId, username);
      // then
      expect(result.likesCount).to.equal(0);
      expect(result.isLiked).to.equal(false);
      expect(imageFind.calledWith(imageId)).to.equal(true);
      expect(userFind.calledWith({ username })).to.equal(true);
      expect(
        likeFind.calledWith({ image: imageId, author: mockUser._id })
      ).to.equal(true);
      expect(likeExist.calledOnce).to.equal(false);
      expect(likeRemove.calledOnce).to.equal(true);
      expect(likesCount.calledWith({ image: imageId })).to.equal(true);
    });
    it("should throw when imageId is not ObjectId type", async () => {
      // given
      const imageId = "123";
      const username = "Hasan Abir";

      sinon.stub(Image, "findById").returns(Promise.resolve(null));

      // then
      await expect(
        feedbackService.unlikeImage(imageId, username)
      ).to.be.rejectedWith("Image not found");
    });
    it("should throw when image is not found", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";
      const username = "Hasan Abir";

      sinon.stub(Image, "findById").returns(Promise.resolve(null));

      // then
      await expect(
        feedbackService.unlikeImage(imageId, username)
      ).to.be.rejectedWith("Image not found");
    });
    it("should throw when image is not liked", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";
      const username = "Hasan Abir";

      sinon.stub(Image, "findById").returns(Promise.resolve(new Image()));
      const mockUser = new User();
      sinon.stub(User, "findOne").returns(Promise.resolve(mockUser));
      sinon.stub(Like, "findOne").returns(Promise.resolve(null));

      // then
      await expect(
        feedbackService.unlikeImage(imageId, username)
      ).to.be.rejectedWith("Image not liked");
    });
  });
  describe("#getLikes()", () => {
    it("should get likes", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";

      const imageExists = sinon
        .stub(Image, "exists")
        .returns(Promise.resolve(true));
      const likeExist = sinon.stub(Like, "exists");
      const likesCount = sinon
        .stub(Like, "countDocuments")
        .returns(Promise.resolve(2));

      // when
      const result = await feedbackService.getLikes(imageId);
      // then
      expect(result.likesCount).to.equal(2);
      expect(result.isLiked).to.equal(false);
      expect(imageExists.calledWith({ _id: imageId })).to.equal(true);
      expect(likeExist.calledOnce).to.equal(false);
      expect(likesCount.calledWith({ image: imageId })).to.equal(true);
    });
    it("should get likes with username", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";
      const username = "Hasan Abir";

      const imageExists = sinon
        .stub(Image, "exists")
        .returns(Promise.resolve(true));
      const mockedUser = new User();
      const userFind = sinon
        .stub(User, "findOne")
        .returns(Promise.resolve(mockedUser));
      const likeExist = sinon.stub(Like, "exists");
      const likesCount = sinon
        .stub(Like, "countDocuments")
        .returns(Promise.resolve(2));

      // when
      const result = await feedbackService.getLikes(imageId, username);
      // then
      expect(result.likesCount).to.equal(2);
      expect(result.isLiked).to.equal(false);
      expect(imageExists.calledWith({ _id: imageId })).to.equal(true);
      expect(userFind.calledWith({ username })).to.equal(true);
      expect(
        likeExist.calledWith({ image: imageId, author: mockedUser._id })
      ).to.equal(true);
      expect(likesCount.calledWith({ image: imageId })).to.equal(true);
    });
    it("should throw when imageId is not ObjectId type", async () => {
      // given
      const imageId = "123";

      sinon.stub(Image, "exists").returns(Promise.resolve(null));

      // then
      await expect(feedbackService.getLikes(imageId)).to.be.rejectedWith(
        "Image not found"
      );
    });
    it("should throw when image is not found", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";

      sinon.stub(Image, "exists").returns(Promise.resolve(null));

      // then
      await expect(feedbackService.getLikes(imageId)).to.be.rejectedWith(
        "Image not found"
      );
    });
  });
  describe("#commentOnImage()", () => {
    it("should post comment on image", async () => {
      // given
      const reqBody = { text: "Lorem ipsum" };
      const imageId = "6333f15d5472f567374519d4";
      const username = "Hasan Abir";

      const imageFind = sinon
        .stub(Image, "findById")
        .returns(Promise.resolve(new Image()));
      const mockUser = new User({ username });
      const userFind = sinon
        .stub(User, "findOne")
        .returns(Promise.resolve(mockUser));
      const commentSave = sinon
        .stub(Comment.prototype, "save")
        .returns(Promise.resolve(null));
      const commentPopulate = sinon.stub(Comment.prototype, "populate").returns(
        Promise.resolve({
          toObject: () => ({
            text: reqBody.text,
            author: new User({ username }),
            image: new Image(),
          }),
        })
      );

      // when
      const result = await feedbackService.commentOnImage(
        reqBody,
        imageId,
        username
      );
      // then
      expect(result.text).to.equal(reqBody.text);
      expect(result.author.username).to.equal(username);
      expect(imageFind.calledWith(imageId)).to.equal(true);
      expect(userFind.calledWith({ username })).to.equal(true);
      expect(commentSave.calledOnce).to.equal(true);
      expect(
        commentPopulate.calledWith("author", "avatar username -_id")
      ).to.equal(true);
    });
    it("should throw when imageId is not ObjectId Type", async () => {
      // given
      const reqBody = { text: "Lorem ipsum" };
      const imageId = "123";
      const username = "Hasan Abir";

      // when
      await expect(
        feedbackService.commentOnImage(reqBody, imageId, username)
      ).to.be.rejectedWith("Image not found");
    });
    it("should throw when imageId is not found", async () => {
      // given
      const reqBody = { text: "Lorem ipsum" };
      const imageId = "6333f15d5472f567374519d4";
      const username = "Hasan Abir";
      sinon.stub(Image, "findById").returns(Promise.resolve(null));

      // when
      await expect(
        feedbackService.commentOnImage(reqBody, imageId, username)
      ).to.be.rejectedWith("Image not found");
    });
  });
  describe("#removeCommentFromImage()", () => {
    it("should remove comment from image", async () => {
      // given
      const commentId = "6333f15d5472f567374519d4";
      const username = "Hasan Abir";

      const mockUser = new User({ username });
      const commentFind = sinon
        .stub(Comment, "findById")
        .returns(Promise.resolve(new Comment({ author: mockUser._id })));
      const userExists = sinon
        .stub(User, "exists")
        .returns(Promise.resolve(mockUser));
      const commentRemove = sinon
        .stub(Comment.prototype, "remove")
        .returns(Promise.resolve(null));

      // when
      await feedbackService.removeCommentFromImage(commentId, username);
      // then
      expect(commentFind.calledWith(commentId)).to.equal(true);
      expect(userExists.calledWith({ username })).to.equal(true);
      expect(commentRemove.calledOnce).to.equal(true);
    });
    it("should throw when commentId is not ObjectId", async () => {
      // given
      const commentId = "123";
      const username = "Hasan Abir";

      // when
      await expect(
        feedbackService.removeCommentFromImage(commentId, username)
      ).to.be.rejectedWith("Comment not found");
    });
    it("should throw when comment is not found", async () => {
      // given
      const commentId = "6333f15d5472f567374519d4";
      const username = "Hasan Abir";

      const commentFind = sinon
        .stub(Comment, "findById")
        .returns(Promise.resolve(null));

      // when
      await expect(
        feedbackService.removeCommentFromImage(commentId, username)
      ).to.be.rejectedWith("Comment not found");
    });
    it("should throw when current user is not the author", async () => {
      // given
      const commentId = "6333f15d5472f567374519d4";
      const username = "Hasan Abir";

      const mockAuthor = new User({ username: "John Doe" });
      const mockUser = new User({ username });
      const commentFind = sinon
        .stub(Comment, "findById")
        .returns(Promise.resolve(new Comment({ author: mockAuthor._id })));
      sinon.stub(User, "exists").returns(Promise.resolve(mockUser));

      // when
      await expect(
        feedbackService.removeCommentFromImage(commentId, username)
      ).to.be.rejectedWith("User doesn't have the permission");
    });
  });
  describe("#getLatestComments()", () => {
    it("should get latest comments", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";
      const comments = [
        { updatedAt: "2022-10-20T06:25:45.115Z" },
        { updatedAt: "2022-10-21T06:25:45.115Z" },
      ];

      const imageFind = sinon
        .stub(Image, "exists")
        .returns(Promise.resolve(new Image()));

      const commentsFind = sinon.stub(Comment, "find").returns({
        sort: sinon.stub().returns({
          limit: sinon.stub().returns({
            select: sinon.stub().returns({
              populate: sinon.stub().returns(Promise.resolve(comments)),
            }),
          }),
        }),
      });

      const commentsCount = sinon
        .stub(Comment, "countDocuments")
        .returns(Promise.resolve(1));

      // when
      const result = await feedbackService.getLatestComments(imageId);
      // then
      expect(result.next).to.equal(comments[1].updatedAt);
      expect(imageFind.calledWith({ _id: imageId })).to.equal(true);
      expect(commentsFind.calledWith({ image: imageId })).to.equal(true);
      expect(commentsFind().sort.calledWith("-updatedAt")).to.equal(true);
      expect(commentsFind().sort().limit.calledWith(10)).to.equal(true);
      expect(
        commentsFind().sort().limit().select.calledWith("-image")
      ).to.equal(true);
      expect(
        commentsFind()
          .sort()
          .limit()
          .select()
          .populate.calledWith("author", "avatar username -_id")
      ).to.equal(true);
      expect(commentsCount.calledOnce).to.equal(true);
    });
    it("should get next batches of comments", async () => {
      // given
      const limit = 5;
      const lastItemTimestamp = "2022-10-19T06:25:45.115Z";
      const imageId = "6333f15d5472f567374519d4";
      const comments = [
        { updatedAt: "2022-10-20T06:25:45.115Z" },
        { updatedAt: "2022-10-21T06:25:45.115Z" },
      ];

      const imageFind = sinon
        .stub(Image, "exists")
        .returns(Promise.resolve(new Image()));

      const commentsFind = sinon.stub(Comment, "find").returns({
        sort: sinon.stub().returns({
          limit: sinon.stub().returns({
            select: sinon.stub().returns({
              populate: sinon.stub().returns(Promise.resolve(comments)),
            }),
          }),
        }),
      });

      const commentsCount = sinon
        .stub(Comment, "countDocuments")
        .returns(Promise.resolve(1));

      // when
      const result = await feedbackService.getLatestComments(
        imageId,
        limit,
        lastItemTimestamp
      );
      // then
      expect(result.next).to.equal(comments[1].updatedAt);
      expect(imageFind.calledWith({ _id: imageId })).to.equal(true);
      expect(
        commentsFind.calledWith({
          image: imageId,
          updatedAt: { $lt: lastItemTimestamp },
        })
      ).to.equal(true);
      expect(commentsFind().sort.calledWith("-updatedAt")).to.equal(true);
      expect(commentsFind().sort().limit.calledWith(limit)).to.equal(true);
      expect(
        commentsFind().sort().limit().select.calledWith("-image")
      ).to.equal(true);
      expect(
        commentsFind()
          .sort()
          .limit()
          .select()
          .populate.calledWith("author", "avatar username -_id")
      ).to.equal(true);
      expect(commentsCount.calledOnce).to.equal(true);

    });
    it("should throw when imageId is not ObjectId type", async () => {
      // given
      const imageId = "123";

      // when
      await expect(
        feedbackService.getLatestComments(imageId)
      ).to.be.rejectedWith("Image not found");
    });
    it("should throw when imageId is not found", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";

      sinon.stub(Image, "exists").returns(Promise.resolve(null));

      // when
      await expect(
        feedbackService.getLatestComments(imageId)
      ).to.be.rejectedWith("Image not found");
    });
  });
});
