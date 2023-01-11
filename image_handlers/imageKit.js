const ImageKit = require("imagekit");
const dotenv = require("dotenv");

dotenv.config();

let publicKey = process.env.IMAGEKIT_PUBLICKEY;
let privateKey = process.env.IMAGEKIT_PRIVATEKEY;

if (process.env.NODE_ENV === "test") {
  publicKey = process.env.TEST_IMAGEKIT_PUBLICKEY;
  privateKey = process.env.TEST_IMAGEKIT_PRIVATEKEY;
}

const imageKit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint: "https://ik.imagekit.io/ozjxi1bzek/",
});

module.exports = imageKit;
