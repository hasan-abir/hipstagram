const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");
const { afterEach } = require("mocha");
const { jwtGenerateToken } = require("../../../jwt_utils");
const { tokenValidation } = require("../../../middlewares/verifyToken");
const User = require("../../../models/User");

describe("Token validation", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should return user with username and email", async () => {
    // given
    const mockedUser = new User({
      username: "Hasan Abir",
      email: "hasanabir@test.com",
    });

    const jwtToken = await jwtGenerateToken(mockedUser);

    const userExists = sinon
      .stub(User, "exists")
      .returns(Promise.resolve(true));

    // when
    const verifiedUser = await tokenValidation("Bearer " + jwtToken);

    // then
    expect(userExists.calledWith({ username: verifiedUser.username })).to.equal(
      true
    );
    expect(verifiedUser.username).to.equal(mockedUser.username);
    expect(verifiedUser.email).to.equal(mockedUser.email);
  });
  it("should throw when no token arg", async () => {
    // then
    await expect(tokenValidation()).to.be.rejectedWith(
      "No token authorization"
    );
  });
  it("should throw when user doesn't exist", async () => {
    // given
    const mockedUser = new User({
      username: "Hasan Abir",
      email: "hasanabir@test.com",
    });

    const jwtToken = await jwtGenerateToken(mockedUser);

    sinon.stub(User, "exists").returns(Promise.resolve(false));

    // then
    await expect(tokenValidation("Bearer " + jwtToken)).to.be.rejectedWith(
      "User doesn't exist"
    );
  });
});
