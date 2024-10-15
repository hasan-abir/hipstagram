const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const { before, afterEach, after } = require("mocha");
const dotenv = require("dotenv");
const dbHandler = require("../../db-handler");
const User = require("../../../models/User");

describe("User", () => {
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

  describe("#comparePassword()", () => {
    it("should match", async () => {
      // given
      const password = "testtest";
      const demoUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username: "Hasan Abir",
        email: "hasanabir@test.com",
        gender: "male",
        password,
      });

      await demoUser.save();

      // when
      const isMatch = await demoUser.comparePassword(password);
      // then
      expect(isMatch).to.equal(true);
    });
    it("should not match", async () => {
      // given
      const password = "testtest";
      const demoUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username: "Hasan Abir",
        email: "hasanabir@test.com",
        gender: "male",
        password: "testtest1",
      });

      await demoUser.save();

      // when
      const isMatch = await demoUser.comparePassword(password);
      // then
      expect(isMatch).to.equal(false);
    });
  });
  describe("#hashPassword()", () => {
    it("should hash the password", async () => {
      // given
      const password = "testtest";
      const demoUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username: "Hasan Abir",
        email: "hasanabir@test.com",
        gender: "male",
        password,
      });

      // when
      await demoUser.hashPassword();
      // then
      expect(password === demoUser.password).to.equal(false);
    });
  });
  describe("#preSave()", () => {
    it("should hash the password", async () => {
      // given
      const password = "testtest";
      const demoUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username: "Hasan Abir",
        email: "hasanabir@test.com",
        gender: "male",
        password,
      });

      // when
      await demoUser.save();
      // then
      expect(password === demoUser.password).to.equal(false);
    });
    it("should skip hashing", async () => {
      // given
      const password = "testtest";
      const demoUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username: "Hasan Abir",
        email: "hasanabir@test.com",
        gender: "male",
        password,
      });
      await demoUser.save();

      // when
      const result = await demoUser.save();
      // then
      expect(demoUser.password === result.password).to.equal(true);
    });
  });
  describe("#validate()", () => {
    it("should throw when username is empty", async () => {
      // given
      const demoUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username: "",
        email: "hasanabir@test.com",
        gender: "male",
        password: "testtest",
      });

      // then
      await expect(demoUser.validate()).to.be.rejectedWith(
        "User validation failed: username: Username is required"
      );
    });
    it("should throw when username already exists", async () => {
      // given
      const existingUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username: "Hasan Abir",
        email: "hasanabir@test.com",
        gender: "male",
        password: "testtest",
      });
      const demoUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username: "Hasan Abir",
        email: "johndoe@test.com",
        gender: "male",
        password: "testtest",
      });

      await existingUser.save();

      // then
      await expect(demoUser.validate()).to.be.rejectedWith(
        "User validation failed: username: User with username already exists"
      );
    });
    it("should throw when email is empty", async () => {
      // given
      const demoUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username: "Hasan Abir",
        email: "",
        gender: "male",
        password: "testtest",
      });

      // then
      await expect(demoUser.validate()).to.be.rejectedWith(
        "User validation failed: email: Email address is required"
      );
    });
    it("should throw when email already exists", async () => {
      // given
      const existingUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username: "Hasan Abir",
        email: "hasanabir@test.com",
        gender: "male",
        password: "testtest",
      });
      const demoUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username: "John Doe",
        email: "hasanabir@test.com",
        gender: "male",
        password: "testtest",
      });

      await existingUser.save();

      // then
      await expect(demoUser.validate()).to.be.rejectedWith(
        "User validation failed: email: User with email already exists"
      );
    });
    it("should throw when email isn't valid", async () => {
      // given
      const demoUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username: "Hasan Abir",
        email: "hasanabir",
        gender: "male",
        password: "testtest",
      });

      // then
      await expect(demoUser.validate()).to.be.rejectedWith(
        "User validation failed: email: Please provide a valid email"
      );
    });
    it("should throw when gender is empty", async () => {
      // given
      const demoUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username: "Hasan Abir",
        email: "hasnabir@test.com",
        gender: "",
        password: "testtest",
      });

      // then
      await expect(demoUser.validate()).to.be.rejectedWith(
        "User validation failed: gender: Gender required to be specified"
      );
    });
    it("should throw when gender isn't valid", async () => {
      // given
      const demoUser = new User({
        avatar: {
          url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
          fileId: "male",
        },
        username: "Hasan Abir",
        email: "hasnabir@test.com",
        gender: "man",
        password: "testtest",
      });

      // then
      await expect(demoUser.validate()).to.be.rejectedWith(
        "User validation failed: gender: Must be 'male', 'female' or 'other'"
      );
    });
  });
});
