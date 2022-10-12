const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");
const { beforeEach, afterEach, before } = require("mocha");
const authService = require("../../services/authService");
const dotenv = require("dotenv");
const User = require("../../models/User");
const ImageKit = require("imagekit");
const verifyAccessToken = require("../../jwt_utils").verifyAccessToken;

describe("AuthService", () => {
  beforeEach(() => {
    dotenv.config();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("#loginUser()", () => {
    it("should login user", async () => {
      // given
      const requestBody = {
        email: "hasanabir@test.com",
        password: "testtest",
      };

      const mockedUser = new User({
        username: "Hasan Abir",
        gender: "male",
        email: requestBody.email,
        password: requestBody.password,
      });
      await mockedUser.hashPassword();

      const userFindOne = sinon
        .stub(User, "findOne")
        .returns(Promise.resolve(mockedUser));

      // when
      const result = await authService.loginUser(requestBody);

      const verified = await verifyAccessToken(result);

      // then
      expect(verified.username).to.equal(mockedUser.username);
      expect(userFindOne.calledWith({ email: requestBody.email })).to.equal(
        true
      );
    });
    it("should throw when user not found", async () => {
      // given
      const requestBody = {
        email: "hasanabir@test.com",
        password: "testtest",
      };
      sinon.stub(User, "findOne").returns(Promise.resolve(null));

      // then
      await expect(authService.loginUser(requestBody)).to.be.rejectedWith(
        "User doesn't exist"
      );
    });
    it("should throw when password doesn't match ", async () => {
      // given
      const requestBody = {
        email: "hasanabir@test.com",
        password: "testtest",
      };
      const mockedUser = new User({
        username: "Hasan Abir",
        gender: "male",
        email: requestBody.email,
        password: requestBody.password + "12",
      });
      await mockedUser.hashPassword();
      sinon.stub(User, "findOne").returns(Promise.resolve(mockedUser));

      // then
      await expect(authService.loginUser(requestBody)).to.be.rejectedWith(
        "Invalid Credentials"
      );
    });
  });
  describe("#getUserByUsername()", () => {
    it("should get user by username", async () => {
      // given
      const username = "Hasan Abir";

      let mockedUser = new User({
        username,
        avatar: {
          url: "url",
          fileId: "fileId",
        },
        gender: "male",
        email: "hasanabir@test.com",
      });

      mockedUser = mockedUser.toObject();

      delete mockedUser._id;
      delete mockedUser._v;

      const userFindOne = sinon.stub(User, "findOne").returns({
        select: sinon.stub().returns(Promise.resolve(mockedUser)),
      });

      // when
      const result = await authService.getUserByUsername(username);

      // then
      expect(userFindOne.calledWith({ username })).to.equal(true);
      expect(userFindOne().select.calledWith("-password -_id -__v")).to.equal(
        true
      );
      expect(result.password).to.equal(undefined);
      expect(result._id).to.equal(undefined);
      expect(result._v).to.equal(undefined);
      expect(result.username).to.equal(mockedUser.username);
      expect(result.avatar).to.equal(mockedUser.avatar);
      expect(result.gender).to.equal(mockedUser.gender);
      expect(result.email).to.equal(mockedUser.email);
      expect(result.created).to.equal(mockedUser.created);
    });
    it("should throw when user not found", async () => {
      // given
      const username = "Hasan Abir";

      sinon.stub(User, "findOne").returns({
        select: sinon.stub().returns(Promise.resolve(null)),
      });

      // then
      await expect(authService.getUserByUsername(username)).to.be.rejectedWith(
        "User doesn't exist"
      );
    });
  });
  describe("#registerUser()", () => {
    it("should register user", async () => {
      // given
      const requestBody = {
        username: "Hasan Abir",
        gender: "male",
        email: "hasanabir@test.com",
        password: "testtest",
      };
      const requestFile = {
        fileName: "example.jpg",
        buffer: { toString: () => {} },
      };

      const imagekitUpload = sinon
        .stub(ImageKit.prototype, "upload")
        .returns(Promise.resolve({ url: "url", fileId: "fileId" }));
      const userValidate = sinon
        .stub(User.prototype, "validate")
        .returns(Promise.resolve(null));
      const userSave = sinon
        .stub(User.prototype, "save")
        .returns(Promise.resolve(null));

      // when
      const result = await authService.registerUser(requestBody, requestFile);

      const verified = await verifyAccessToken(result);

      // then
      expect(verified.username).to.equal(requestBody.username);
      expect(imagekitUpload.calledOnce).to.equal(true);
      expect(userValidate.calledOnce).to.equal(true);
      expect(userSave.calledOnce).to.equal(true);
    });
    it("should throw when password less than 8 chars", async () => {
      // given
      const requestBody = {
        username: "Hasan Abir",
        gender: "male",
        email: "hasanabir@test.com",
        password: "test",
      };

      // then
      await expect(authService.registerUser(requestBody)).to.be.rejectedWith(
        "Password must be at least 8 characters long"
      );
    });
  });
});
