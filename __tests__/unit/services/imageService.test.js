const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");
const { afterEach } = require("mocha");
const imageService = require("../../../services/imageService");
const User = require("../../../models/User");
const Image = require("../../../models/Image");
const ImageKit = require("imagekit");

describe("ImageService", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("#uploadImage()", () => {
    it("should upload image", async () => {
      // given
      const reqBody = { caption: "Lorem ipsum" };
      const reqFile = {
        fileName: "example.jpg",
        buffer: { toString: () => {} },
      };
      const username = "Hasan Abir";

      const imagekitUpload = sinon
        .stub(ImageKit.prototype, "upload")
        .returns(Promise.resolve({ url: "url", fileId: "fileId" }));
      const mockedUser = new User({
        username,
        gender: "male",
        email: "hasanabir@test.com",
        password: "testtest",
      });
      const getUserByEmail = sinon.stub(User, "findOne").returns(mockedUser);
      const imageSave = sinon.stub(Image.prototype, "save");
      const imagePopulateUser = sinon
        .stub(Image.prototype, "populate")
        .returns(Promise.resolve(null));

      // when
      await imageService.uploadImage(reqBody, reqFile, username);

      // then
      expect(imagekitUpload.calledOnce).to.equal(true);
      expect(getUserByEmail.calledWith({ username })).to.equal(true);
      expect(imageSave.calledOnce).to.equal(true);
      expect(imagePopulateUser.calledOnce).to.equal(true);
    });
    it("should return error when no image provided", async () => {
      // given
      const reqBody = { caption: "Lorem ipsum" };
      const username = "Hasan Abir";

      // then
      await expect(
        imageService.uploadImage(reqBody, null, username)
      ).to.be.rejectedWith("Please select an image to upload.");
    });

    it("should return error when user not found", async () => {
      // given
      const reqBody = { caption: "Lorem ipsum" };
      const reqFile = {
        fileName: "example.jpg",
        buffer: { toString: () => {} },
      };
      const username = "Hasan Abir";

      sinon.stub(User, "findOne").returns(null);

      // then
      await expect(
        imageService.uploadImage(reqBody, reqFile, username)
      ).to.be.rejectedWith("User doesn't exist");
    });
  });
  describe("#removeImage()", () => {
    it("should remove image", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";
      const username = "Hasan Abir";

      const mockedImage = new Image({
        file: { fileId: "fileId" },
        author: new User({ username }),
      });
      const imagePopulateUser = sinon.stub(Image, "findById").returns({
        populate: sinon.stub().returns(Promise.resolve(mockedImage)),
      });
      const imageKitDelete = sinon.stub(ImageKit.prototype, "deleteFile");
      const imageDelete = sinon
        .stub(Image.prototype, "remove")
        .returns(Promise.resolve(null));

      // when
      await imageService.removeImage(imageId, username);

      // then
      expect(imagePopulateUser.calledWith(imageId)).to.equal(true);
      expect(
        imagePopulateUser().populate.calledWith(
          "author",
          "avatar username -_id"
        )
      ).to.equal(true);
      expect(imageKitDelete.calledWith(mockedImage.file.fileId)).to.equal(true);
      expect(imageDelete.calledOnce).to.equal(true);
    });
    it("should return error when id is not ObjectId type", async () => {
      // given
      const imageId = "123";
      const username = "Hasan Abir";

      // then
      await expect(
        imageService.removeImage(imageId, username)
      ).to.be.rejectedWith("Image not found");
    });
    it("should return error when image not found", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";
      const username = "Hasan Abir";

      sinon.stub(Image, "findById").returns({
        populate: sinon.stub().returns(Promise.resolve(null)),
      });

      // then
      await expect(
        imageService.removeImage(imageId, username)
      ).to.be.rejectedWith("Image not found");
    });
    it("should return error when username not equal to image author", async () => {
      // given
      const imageId = "6333f15d5472f567374519d4";
      const username = "Hasan Abir";

      sinon.stub(Image, "findById").returns({
        populate: sinon
          .stub()
          .returns(
            Promise.resolve(
              new Image({ author: new User({ username: "John Doe" }) })
            )
          ),
      });

      // then
      await expect(
        imageService.removeImage(imageId, username)
      ).to.be.rejectedWith("Unauthorized");
    });
  });
  describe("#updateImage()", () => {
    it("should update image", async () => {
      // given
      const reqBody = { caption: "Lorem Ipsum" };
      const imageId = "6333f15d5472f567374519d4";
      const username = "Hasan Abir";

      const imagePopulateUser = sinon.stub(Image, "findById").returns({
        populate: sinon.stub().returns(
          Promise.resolve(
            new Image({
              file: { fileId: "fileId" },
              author: new User({ username }),
            })
          )
        ),
      });

      const imageSave = sinon
        .stub(Image.prototype, "save")
        .returns(Promise.resolve(null));

      // when
      await imageService.updateImage(reqBody, imageId, username);

      // then
      expect(imagePopulateUser.calledWith(imageId)).to.equal(true);

      expect(
        imagePopulateUser().populate.calledWith(
          "author",
          "avatar username -_id"
        )
      ).to.equal(true);
      expect(imageSave.calledOnce).to.equal(true);
    });
    it("should return error when id is not ObjectId type", async () => {
      // given
      const reqBody = { caption: "Lorem Ipsum" };
      const imageId = "123";
      const username = "Hasan Abir";

      // then
      await expect(
        imageService.updateImage(reqBody, imageId, username)
      ).to.be.rejectedWith("Image not found");
    });
    it("should return error when image not found", async () => {
      // given
      const reqBody = { caption: "Lorem Ipsum" };
      const imageId = "6333f15d5472f567374519d4";
      const username = "Hasan Abir";

      sinon.stub(Image, "findById").returns({
        populate: sinon.stub().returns(Promise.resolve(null)),
      });

      // then
      await expect(
        imageService.updateImage(reqBody, imageId, username)
      ).to.be.rejectedWith("Image not found");
    });
    it("should return error when username is not equal image author", async () => {
      // given
      const reqBody = { caption: "Lorem Ipsum" };
      const imageId = "6333f15d5472f567374519d4";
      const username = "Hasan Abir";

      sinon.stub(Image, "findById").returns({
        populate: sinon
          .stub()
          .returns(
            Promise.resolve(
              new Image({ author: new User({ username: "John Doe" }) })
            )
          ),
      });

      // when
      await expect(
        imageService.updateImage(reqBody, imageId, username)
      ).to.be.rejectedWith("Unauthorized");
    });
  });
  describe("#getLatestImages()", () => {
    it("should get latest images", async () => {
      // given
      const images = [
        { updatedAt: "2022-10-20T06:25:45.115Z" },
        { updatedAt: "2022-10-21T06:25:45.115Z" },
      ];
      const imagesFind = sinon.stub(Image, "find").returns({
        sort: sinon.stub().returns({
          limit: sinon.stub().returns({
            select: sinon.stub().returns(Promise.resolve(images)),
          }),
        }),
      });

      // when
      const result = await imageService.getLatestImages();

      // then
      expect(result.next).to.equal(images[1].updatedAt);
      expect(imagesFind().sort.calledWith("-updatedAt")).to.equal(true);
      expect(imagesFind().sort().limit.calledWith(10)).to.equal(true);
      expect(
        imagesFind().sort().limit().select.calledWith("file caption updatedAt")
      ).to.equal(true);
    });
    it("should get the next batch of images", async () => {
      // given
      const limit = 5;
      const lastItemTimestamp = "2022-10-19T06:25:45.115Z";

      const images = [
        { updatedAt: "2022-10-20T06:25:45.115Z" },
        { updatedAt: "2022-10-21T06:25:45.115Z" },
      ];
      const imagesFind = sinon.stub(Image, "find").returns({
        sort: sinon.stub().returns({
          limit: sinon.stub().returns({
            select: sinon.stub().returns(Promise.resolve(images)),
          }),
        }),
      });

      // when
      const result = await imageService.getLatestImages(
        limit,
        lastItemTimestamp
      );

      // then
      expect(result.next).to.equal(images[1].updatedAt);
      expect(
        imagesFind.calledWith({
          updatedAt: { $lt: lastItemTimestamp },
        })
      ).to.equal(true);
      expect(imagesFind().sort.calledWith("-updatedAt")).to.equal(true);
      expect(imagesFind().sort().limit.calledWith(limit)).to.equal(true);
      expect(
        imagesFind().sort().limit().select.calledWith("file caption updatedAt")
      ).to.equal(true);
    });
  });
});
