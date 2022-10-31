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

describe("Verify token middleware", () => {
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

  it("should return error when no token arg", async () => {
    // when
    const res = await chai
      .request(app)
      .post("/api/images/upload")
      .set("x-api-key", process.env.API_KEY);
    // .set("authorization", "Bearer " + token)

    expect(res).to.have.status(401);
    expect(res.body.msg).to.equal("Unauthorized: No token authorization");
  });

  it("should return error when user doesn't exist", async () => {
    // given
    const demoUser = new User({
      username: "Hasan Abir",
      email: "hasanabir@test.com",
    });

    const jwtToken = await jwtGenerateToken(demoUser);
    // when
    const res = await chai
      .request(app)
      .post("/api/images/upload")
      .set("x-api-key", process.env.API_KEY)
      .set("authorization", "Bearer " + jwtToken);

    expect(res).to.have.status(401);
    expect(res.body.msg).to.equal("Unauthorized: User doesn't exist");
  });
});
