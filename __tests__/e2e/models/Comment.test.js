const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const { before, afterEach, after } = require("mocha");
const dotenv = require("dotenv");
const dbHandler = require("../../db-handler");
const Comment = require("../../../models/Comment");

describe("Comment", () => {
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

  describe("#validate()", () => {
    it("should throw when text is empty", async () => {
      // given
      const comment = new Comment({ text: "" });

      // when
      await expect(comment.validate()).to.be.rejectedWith(
        "Comment validation failed: text: Text is required"
      );
    });
  });
});
