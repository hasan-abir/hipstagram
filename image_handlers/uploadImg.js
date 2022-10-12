const imageKit = require("./imageKit");

module.exports = async (file, folder) => {
  const response = await imageKit.upload({
    file: file.buffer.toString("base64"),
    fileName: file.originalname,
    folder,
  });

  imgObj = {
    url: response.url,
    fileId: response.fileId,
  };

  return imgObj;
};
