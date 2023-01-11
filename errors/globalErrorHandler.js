const multer = require("multer");

module.exports = (appInstance) => {
  appInstance.use((err, req, res, next) => {
    /* Mongoose schema validation */
    if (err.name === "ValidationError") {
      let errors = {};

      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });

      return res.status(400).json(errors);
    }

    /* Image upload validation */
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ msg: "Maximum file size of 2 MB is accepted" });
    }
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_TYPE") {
      return res
        .status(400)
        .json({ msg: "Only .jpg, .png or .webp file types are accepted" });
    }

    if (err.statusCode && err.message) {
      return res.status(err.statusCode).json({ msg: err.message });
    }

    /* Fallback */
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  });
};
