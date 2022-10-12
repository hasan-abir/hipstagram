const express = require("express");
const verifyKey = require("../middlewares/verifyKey");
const globalErrorHandler = require("../errors/globalErrorHandler");

const app = express();

/* Enable parsing incoming requests with JSON */
app.use(express.json());

/* Available endpoints (protected by middleware that verifies API key) */
// Authentication / Authorization
app.use("/api/auth/", verifyKey, require("../controllers/authController"));
// Business Logic (image uploading features)
app.use("/api/images/", verifyKey, require("../controllers/imagesController"));

/* Global error handling */
globalErrorHandler(app);

module.exports = app;
