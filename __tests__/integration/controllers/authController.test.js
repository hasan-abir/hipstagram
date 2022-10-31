process.env.NODE_ENV = "test";

const fs = require("fs");
const path = require("path");
const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const { before, afterEach, after } = require("mocha");
chai.use(chaiHttp);
const dotenv = require("dotenv");
const dbHandler = require("../../db-handler");
const app = require("../../../server");
const User = require("../../../models/User");
const imageKit = require("../../../image_handlers/imageKit");

describe("AuthController", () => {
  before(async () => {
    dotenv.config();
    await dbHandler.connect();
  });
  afterEach(async () => {
    await dbHandler.clearDatabase();
  });
  after(async () => {
    await dbHandler.closeDatabase();
  });

  describe("GET: /api/auth/user/:username", () => {
    it("should get the user", async () => {
      // given
      const username = "hasanabir";

      const demoUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username,
        email: "hasanabir@test.com",
        gender: "male",
        password: "testtest",
      });

      await demoUser.save();

      // when
      const res = await chai
        .request(app)
        .get("/api/auth/user/" + username)
        .set("x-api-key", process.env.API_KEY);

      expect(res).to.have.status(200);
    });
    it("should return error when the user doesn't exist", async () => {
      // given
      const username = "hasanabir";

      // when
      const res = await chai
        .request(app)
        .get("/api/auth/user/" + username)
        .set("x-api-key", process.env.API_KEY);

      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("User doesn't exist");
    });
  });
  describe("POST: /api/auth/login", () => {
    it("should authenticate user", async () => {
      // given
      const reqBody = {
        email: "hasanabir@test.com",
        password: "testtest",
      };

      const demoUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username: "Hasan Abir",
        email: reqBody.email,
        gender: "male",
        password: reqBody.password,
      });

      await demoUser.save();

      // when
      const res = await chai
        .request(app)
        .post("/api/auth/login")
        .set("x-api-key", process.env.API_KEY)
        .send(reqBody);

      expect(res).to.have.status(200);
      expect(res.body.hasOwnProperty("token")).to.equal(true);
    });
    it("should return error when user doesn't exist", async () => {
      // given
      const reqBody = {
        email: "hasanabir@test.com",
        password: "testtest",
      };

      // when
      const res = await chai
        .request(app)
        .post("/api/auth/login")
        .set("x-api-key", process.env.API_KEY)
        .send(reqBody);

      expect(res).to.have.status(404);
      expect(res.body.msg).to.equal("User doesn't exist");
    });
    it("should return error when passwords don't match", async () => {
      // given
      const reqBody = {
        email: "hasanabir@test.com",
        password: "testtest1",
      };

      const demoUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username: "Hasan Abir",
        email: reqBody.email,
        gender: "male",
        password: "testtest",
      });

      await demoUser.save();

      // when
      const res = await chai
        .request(app)
        .post("/api/auth/login")
        .set("x-api-key", process.env.API_KEY)
        .send(reqBody);

      // then
      expect(res).to.have.status(401);
      expect(res.body.msg).to.equal("Invalid Credentials");
    });
  });
  describe("POST: /api/auth/register", () => {
    it("should register the user", async function () {
      this.timeout(20000);

      // given
      const reqBody = {
        username: "Hasan Abir",
        gender: "male",
        email: "hasanabir@test.com",
        password: "testtest",
      };

      const reqFile = fs.readFileSync(
        path.resolve(__dirname, "..", "..", "test_images", "good-size.jpg")
      );

      // when
      const res = await chai
        .request(app)
        .post("/api/auth/register")
        .set("x-api-key", process.env.API_KEY)
        .set("content-type", "multipart/form-data")
        .field("username", reqBody.username)
        .field("gender", reqBody.gender)
        .field("email", reqBody.email)
        .field("password", reqBody.password)
        .attach("avatar", reqFile, "good-size.jpg");

      // then
      expect(res).to.have.status(200);
      expect(res.body.hasOwnProperty("token")).to.equal(true);

      const savedUser = await User.findOne({ email: reqBody.email });

      await imageKit.deleteFile(savedUser.avatar.fileId);
    });
    it("should return error when password has less than 8 chars", async () => {
      // given
      const reqBody = {
        username: "Hasan Abir",
        gender: "male",
        email: "hasanabir@test.com",
        password: "test",
      };

      // when
      const res = await chai
        .request(app)
        .post("/api/auth/register")
        .set("x-api-key", process.env.API_KEY)
        .set("content-type", "multipart/form-data")
        .field("username", reqBody.username)
        .field("gender", reqBody.gender)
        .field("email", reqBody.email)
        .field("password", reqBody.password);

      // then
      expect(res).to.have.status(400);
      expect(res.body.msg).to.equal(
        "Password must be at least 8 characters long"
      );
    });
    it("should register user with male gender", async () => {
      // given
      const reqBody = {
        username: "Hasan Abir",
        gender: "male",
        email: "hasanabir@test.com",
        password: "testtest",
      };

      // when
      const res = await chai
        .request(app)
        .post("/api/auth/register")
        .set("x-api-key", process.env.API_KEY)
        .set("content-type", "multipart/form-data")
        .field("username", reqBody.username)
        .field("gender", reqBody.gender)
        .field("email", reqBody.email)
        .field("password", reqBody.password);

      const savedUser = await User.findOne({ email: reqBody.email });

      // then
      expect(res).to.have.status(200);
      expect(res.body.hasOwnProperty("token")).to.equal(true);
      expect(savedUser.avatar.fileId).to.equal("male");
    });
    it("should register user with female gender", async () => {
      // given
      const reqBody = {
        username: "Hasan Abir",
        gender: "female",
        email: "hasanabir@test.com",
        password: "testtest",
      };

      // when
      const res = await chai
        .request(app)
        .post("/api/auth/register")
        .set("x-api-key", process.env.API_KEY)
        .set("content-type", "multipart/form-data")
        .field("username", reqBody.username)
        .field("gender", reqBody.gender)
        .field("email", reqBody.email)
        .field("password", reqBody.password);

      const savedUser = await User.findOne({ email: reqBody.email });

      // then
      if (!res.body.token) console.log(res.body);

      expect(res).to.have.status(200);
      expect(res.body.hasOwnProperty("token")).to.equal(true);
      expect(savedUser.avatar.fileId).to.equal("female");
    });
    it("should register user with other gender", async () => {
      // given
      const reqBody = {
        username: "Hasan Abir",
        gender: "other",
        email: "hasanabir@test.com",
        password: "testtest",
      };

      // when
      const res = await chai
        .request(app)
        .post("/api/auth/register")
        .set("x-api-key", process.env.API_KEY)
        .set("content-type", "multipart/form-data")
        .field("username", reqBody.username)
        .field("gender", reqBody.gender)
        .field("email", reqBody.email)
        .field("password", reqBody.password);

      const savedUser = await User.findOne({ email: reqBody.email });

      // then
      expect(res).to.have.status(200);
      expect(res.body.hasOwnProperty("token")).to.equal(true);
      expect(savedUser.avatar.fileId).to.equal("unknown");
    });
    it("should return error when image size is too large", async () => {
      // given
      const reqBody = {
        username: "Hasan Abir",
        gender: "male",
        email: "hasanabir@test.com",
        password: "testtest",
      };

      const reqFile = fs.readFileSync(
        path.resolve(__dirname, "..", "..", "test_images", "oversized.jpg")
      );

      // when
      const res = await chai
        .request(app)
        .post("/api/auth/register")
        .set("x-api-key", process.env.API_KEY)
        .set("content-type", "multipart/form-data")
        .field("username", reqBody.username)
        .field("gender", reqBody.gender)
        .field("email", reqBody.email)
        .field("password", reqBody.password)
        .attach("avatar", reqFile, "oversized.jpg");

      // then
      expect(res).to.have.status(400);
      expect(res.body.msg).to.equal("Maximum file size of 2 MB is accepted");
    });
    it("should return error when image format isn't correct", async () => {
      // given
      const reqBody = {
        username: "Hasan Abir",
        gender: "male",
        email: "hasanabir@test.com",
        password: "testtest",
      };

      const reqFile = fs.readFileSync(
        path.resolve(__dirname, "..", "..", "test_images", "test.txt")
      );

      // when
      const res = await chai
        .request(app)
        .post("/api/auth/register")
        .set("x-api-key", process.env.API_KEY)
        .set("content-type", "multipart/form-data")
        .field("username", reqBody.username)
        .field("gender", reqBody.gender)
        .field("email", reqBody.email)
        .field("password", reqBody.password)
        .attach("avatar", reqFile, "test.txt");

      // then
      expect(res).to.have.status(400);
      expect(res.body.msg).to.equal(
        "Only .jpg or .png file types are accepted"
      );
    });
    it("should return error if the username is already registered", async function () {
      // given
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

      const reqBody = {
        username: demoUser.username,
        gender: "male",
        email: "hasan@test.com",
        password: "testtest",
      };

      // when
      const res = await chai
        .request(app)
        .post("/api/auth/register")
        .set("x-api-key", process.env.API_KEY)
        .set("content-type", "multipart/form-data")
        .field("username", reqBody.username)
        .field("gender", reqBody.gender)
        .field("email", reqBody.email)
        .field("password", reqBody.password);

      // then
      expect(res).to.have.status(400);
      expect(res.body.username).to.equal("User with username already exists");
    });
    it("should return error if the email is already registered", async function () {
      // given
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

      const reqBody = {
        username: "Hasan",
        gender: "male",
        email: demoUser.email,
        password: "testtest",
      };

      // when
      const res = await chai
        .request(app)
        .post("/api/auth/register")
        .set("x-api-key", process.env.API_KEY)
        .set("content-type", "multipart/form-data")
        .field("username", reqBody.username)
        .field("gender", reqBody.gender)
        .field("email", reqBody.email)
        .field("password", reqBody.password);

      // then
      expect(res).to.have.status(400);
      expect(res.body.email).to.equal("User with email already exists");
    });
  });
});
