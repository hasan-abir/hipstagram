const ImageKit = require("imagekit");
const dotenv = require("dotenv");

dotenv.config();

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLICKEY,
  privateKey: process.env.IMAGEKIT_PRIVATEKEY,
  urlEndpoint: "https://ik.imagekit.io/ozjxi1bzek/"
});

module.exports = imageKit;
