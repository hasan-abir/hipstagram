process.env.NODE_ENV = "test";

const fs = require("fs");
const path = require("path");
const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const { before, beforeEach, afterEach, after } = require("mocha");
chai.use(chaiHttp);
const dotenv = require("dotenv");
const dbHandler = require("../../db-handler");
const app = require("../../../server");
const { jwtGenerateToken } = require("../../../jwt_utils");
const imageKit = require("../../../image_handlers/imageKit");
const Image = require("../../../models/Image");
const User = require("../../../models/User");

describe("ImagesController", () => {
  before(async () => {
    dotenv.config();
    await dbHandler.connect();
  });
  beforeEach(async () => {
    const demoUser = new User({
      avatar: {
        url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
        fileId: "male",
      },
      username: "Hasan Abir",
      gender: "male",
      email: "hasanabir@test.com",
      password: "testtest",
    });
    await demoUser.save();
  });
  afterEach(async () => {
    await dbHandler.clearDatabase();
  });
  after(async () => {
    await dbHandler.closeDatabase();
  });

  describe("GET: /api/images/details/:id", () => {
    it("should get the image", async () => {
      // given
      const author = await User.findOne({ username: "Hasan Abir" });

      let newImage = new Image({
        file: { url: "url", fileId: "fileId" },
        author,
      });
      newImage = await newImage.save();

      // when
      const res = await chai
        .request(app)
        .get("/api/images/details/" + newImage._id)
        .set("x-api-key", process.env.API_KEY);

      expect(res).to.have.status(200);
      expect(res.body.file.fileId).to.equal(newImage.file.fileId);
      expect(res.body.author.hasOwnProperty("username")).to.equal(true);
      expect(
        res.body.hasOwnProperty("likes") && res.body.hasOwnProperty("comments")
      ).to.equal(false);
    });
    it("should return error when imageId is not ObjectId Type", async () => {
      // given
      const imageId = "123";

      // when
      const res = await chai
        .request(app)
        .get("/api/images/details/" + imageId)
        .set("x-api-key", process.env.API_KEY);

      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("Image not found");
    });
    it("should return error when image is not found", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";

      // when
      const res = await chai
        .request(app)
        .get("/api/images/details/" + imageId)
        .set("x-api-key", process.env.API_KEY);

      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("Image not found");
    });
  });
  describe("GET: /api/images/latest", () => {
    it("should get latest images", async () => {
      // given
      const limit = 2;
      const imageBody = {
        file: { url: "url", fileId: "fileId" },
      };
      let newImageA = new Image({ ...imageBody, caption: "A" });
      let newImageB = new Image({ ...imageBody, caption: "B" });
      let newImageC = new Image({ ...imageBody, caption: "C" });
      let newImageD = new Image({ ...imageBody, caption: "D" });
      newImageA = await newImageA.save();
      newImageB = await newImageB.save();
      newImageC = await newImageC.save();
      newImageD = await newImageD.save();

      // when
      const res = await chai
        .request(app)
        .get("/api/images/latest")
        .query({ limit })
        .set("x-api-key", process.env.API_KEY);

      // then
      expect(res).to.have.status(200);
      expect(res.body.next).to.equal(newImageC.updatedAt.toISOString());
      expect(res.body.images[0].caption).to.equal(newImageD.caption);
      expect(res.body.images[1].caption).to.equal(newImageC.caption);
    });
    it("should get next batch of images", async () => {
      // given
      const limit = 2;
      const imageBody = {
        file: { url: "url", fileId: "fileId" },
      };
      let newImageA = new Image({ ...imageBody, caption: "A" });
      let newImageB = new Image({ ...imageBody, caption: "B" });
      let newImageC = new Image({ ...imageBody, caption: "C" });
      let newImageD = new Image({ ...imageBody, caption: "D" });
      newImageA = await newImageA.save();
      newImageB = await newImageB.save();
      newImageC = await newImageC.save();
      newImageD = await newImageD.save();
      const lastItemTimestamp = newImageC.updatedAt;

      // when
      const res = await chai
        .request(app)
        .get("/api/images/latest")
        .query({ limit, next: lastItemTimestamp })
        .set("x-api-key", process.env.API_KEY);

      // then
      expect(res).to.have.status(200);
      expect(res.body.next).to.equal(newImageA.updatedAt.toISOString());
      expect(res.body.images[0].caption).to.equal(newImageB.caption);
      expect(res.body.images[1].caption).to.equal(newImageA.caption);
    });
    it("should return empty images", async () => {
      // when
      const res = await chai
        .request(app)
        .get("/api/images/latest")
        .set("x-api-key", process.env.API_KEY);

      // then
      expect(res).to.have.status(200);
      expect(res.body.images).to.be.an("array").that.is.empty;
      expect(res.body.next).to.equal(false);
    });
  });
  describe("POST: /api/images/upload", () => {
    it("should upload the image", async function () {
      this.timeout(20000);
      // given
      const reqBody = { caption: "Lorem ipsum" };
      const reqFile = fs.readFileSync(
        path.resolve(__dirname, "..", "..", "test_images", "good-size.jpg")
      );
      const token = await jwtGenerateToken({
        username: "Hasan Abir",
        email: "hasanabir@test.com",
      });

      // when
      const res = await chai
        .request(app)
        .post("/api/images/upload")
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token)
        .set("content-type", "multipart/form-data")
        .field("caption", reqBody.caption)
        .attach("file", reqFile, "good-size.jpg");

      // then
      expect(res).to.have.status(200);
      expect(res.body.hasOwnProperty("_id")).to.equal(true);
      expect(res.body.hasOwnProperty("file")).to.equal(true);
      expect(res.body.file.hasOwnProperty("fileId")).to.equal(true);
      expect(res.body.file.hasOwnProperty("url")).to.equal(true);
      expect(res.body.hasOwnProperty("author")).to.equal(true);
      expect(res.body.author.hasOwnProperty("username")).to.equal(true);
      expect(res.body.hasOwnProperty("caption")).to.equal(true);
      expect(res.body.hasOwnProperty("createdAt")).to.equal(true);
      expect(res.body.hasOwnProperty("updatedAt")).to.equal(true);
      expect(
        res.body.hasOwnProperty("likes") && res.body.hasOwnProperty("comments")
      ).to.equal(false);

      const imageUploaded = await Image.exists({ caption: reqBody.caption });
      expect(imageUploaded.hasOwnProperty("_id")).to.equal(true);

      const savedImage = await Image.findById(res.body._id);

      await imageKit.deleteFile(savedImage.file.fileId);
    });
    it("should return error when image is not provided", async () => {
      // given
      const token = await jwtGenerateToken({
        username: "Hasan Abir",
        email: "hasanabir@test.com",
      });

      // when
      const res = await chai
        .request(app)
        .post("/api/images/upload")
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token);

      // then
      expect(res).to.have.status(400);
      expect(res.body.msg).to.equal("Please select an image to upload.");
    });
    it("should return error when image size is too large", async () => {
      // given
      const reqBody = { caption: "Lorem ipsum" };
      const reqFile = fs.readFileSync(
        path.resolve(__dirname, "..", "..", "test_images", "oversized.jpg")
      );
      const token = await jwtGenerateToken({
        username: "Hasan Abir",
        email: "hasanabir@test.com",
      });

      // when
      const res = await chai
        .request(app)
        .post("/api/images/upload")
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token)
        .set("content-type", "multipart/form-data")
        .field("caption", reqBody.caption)
        .attach("file", reqFile, "oversized.jpg");

      // then
      expect(res).to.have.status(400);
      expect(res.body.msg).to.equal("Maximum file size of 2 MB is accepted");
    });
    it("should return error when image format isn't correct", async () => {
      // given
      const reqBody = { caption: "Lorem ipsum" };
      const reqFile = fs.readFileSync(
        path.resolve(__dirname, "..", "..", "test_images", "test.txt")
      );
      const token = await jwtGenerateToken({
        username: "Hasan Abir",
        email: "hasanabir@test.com",
      });

      // when
      const res = await chai
        .request(app)
        .post("/api/images/upload")
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token)
        .set("content-type", "multipart/form-data")
        .field("caption", reqBody.caption)
        .attach("file", reqFile, "test.txt");

      // then
      expect(res).to.have.status(400);
      expect(res.body.msg).to.equal(
        "Only .jpg or .png file types are accepted"
      );
    });
  });
  describe("DELETE: /api/images/remove/:id", () => {
    it("should delete the image", async function () {
      this.timeout(20000);

      // given
      const reqFile = fs.readFileSync(
        path.resolve(__dirname, "..", "..", "test_images", "good-size.jpg")
      );
      const { fileId, url } = await imageKit.upload({
        file: reqFile.buffer.toString("base64"),
        fileName: "good-size.jpg",
        folder: "hipstagram_content",
      });
      const author = await User.findOne({ username: "Hasan Abir" });
      let newImage = new Image({
        file: { url, fileId },
        author,
        caption: "Lorem ipsum",
      });
      await newImage.save();
      const imageId = newImage._id;

      const token = await jwtGenerateToken({
        username: "Hasan Abir",
        email: "hasanabir@test.com",
      });

      // when
      const res = await chai
        .request(app)
        .delete("/api/images/remove/" + imageId)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token)
        .set("content-type", "multipart/form-data");

      // then
      expect(res).to.have.status(200);
      expect(res.body.msg).to.equal("Successfully deleted");

      const imageUploaded = await Image.exists({ caption: newImage.caption });
      expect(imageUploaded).to.be.null;
    });
    it("should return error when id is not ObjectId type", async () => {
      // given
      const imageId = "123";

      const token = await jwtGenerateToken({
        username: "Hasan Abir",
        email: "hasanabir@test.com",
      });

      // when
      const res = await chai
        .request(app)
        .delete("/api/images/remove/" + imageId)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token)
        .set("content-type", "multipart/form-data");

      // then
      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("Image not found");
    });
    it("should return error when image is not found", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";

      const token = await jwtGenerateToken({
        username: "Hasan Abir",
        email: "hasanabir@test.com",
      });

      // when
      const res = await chai
        .request(app)
        .delete("/api/images/remove/" + imageId)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token)
        .set("content-type", "multipart/form-data");

      // then
      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("Image not found");
    });
    it("should return error when current user isn't the author", async () => {
      // given
      const author = await User.findOne({ username: "Hasan Abir" });
      const currentUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username: "John Doe",
        gender: "male",
        email: "johndoe@test.com",
        password: "testtest",
      });
      await currentUser.save();
      let newImage = new Image({
        file: { url: "url", fileId: "fileId" },
        author,
      });
      await newImage.save();
      const imageId = newImage._id;

      const token = await jwtGenerateToken(currentUser);

      // when
      const res = await chai
        .request(app)
        .delete("/api/images/remove/" + imageId)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token)
        .set("content-type", "multipart/form-data");

      // then
      expect(res).to.have.status(401);
      expect(res.body.msg).to.equal("Unauthorized");
    });
  });
  describe("PUT: /api/images/edit/:id", () => {
    it("should update the image", async () => {
      // given
      const reqBody = { caption: "Lorem Ipsum" };
      const author = await User.findOne({ username: "Hasan Abir" });
      let newImage = new Image({
        file: { url: "url", fileId: "fileId" },
        author,
      });
      await newImage.save();
      const imageId = newImage._id;

      const token = await jwtGenerateToken({
        username: "Hasan Abir",
        email: "hasanabir@test.com",
      });

      // when
      const res = await chai
        .request(app)
        .put("/api/images/edit/" + imageId)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token)
        .send(reqBody);

      // then
      expect(res).to.have.status(200);
      expect(res.body.caption).to.equal(reqBody.caption);
      expect(
        res.body.hasOwnProperty("likes") && res.body.hasOwnProperty("comments")
      ).to.equal(false);
    });
    it("should return error when id is not ObjectId type", async () => {
      // given
      const reqBody = { caption: "Lorem Ipsum" };
      const imageId = "123";

      const token = await jwtGenerateToken({
        username: "Hasan Abir",
        email: "hasanabir@test.com",
      });

      // when
      const res = await chai
        .request(app)
        .put("/api/images/edit/" + imageId)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token)
        .send(reqBody);

      // then
      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("Image not found");
    });
    it("should return error when image is not found", async () => {
      // given
      const reqBody = { caption: "Lorem Ipsum" };
      const imageId = "6333f15d5472f567374519d4";

      const token = await jwtGenerateToken({
        username: "Hasan Abir",
        email: "hasanabir@test.com",
      });

      // when
      const res = await chai
        .request(app)
        .put("/api/images/edit/" + imageId)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token)
        .send(reqBody);

      // then
      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("Image not found");
    });
    it("should return error when current user isn't the author", async () => {
      // given
      const reqBody = { caption: "Lorem Ipsum" };
      const author = await User.findOne({ username: "Hasan Abir" });
      const currentUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username: "John Doe",
        gender: "male",
        email: "johndoe@test.com",
        password: "testtest",
      });
      await currentUser.save();
      let newImage = new Image({
        file: { url: "url", fileId: "fileId" },
        author,
      });
      await newImage.save();
      const imageId = newImage._id;

      const token = await jwtGenerateToken(currentUser);

      // when
      const res = await chai
        .request(app)
        .put("/api/images/edit/" + imageId)
        .set("x-api-key", process.env.API_KEY)
        .set("authorization", "Bearer " + token)
        .send(reqBody);

      // then
      expect(res).to.have.status(401);
      expect(res.body.msg).to.equal("Unauthorized");
    });
  });
});
