const express = require("express");
const verifyKeyMiddleware = require("../middlewares/verifyKey");
const globalErrorHandler = require("../errors/globalErrorHandler");

const app = express();

/* Enable parsing incoming requests with JSON */
app.use(express.json());

/* Available endpoints (protected by middleware that verifies API key) */
// Authentication / Authorization
app.use(
  "/api/auth/",
  verifyKeyMiddleware,
  require("../controllers/authController")
);
// Business Logic (image uploading features)
app.use(
  "/api/images/",
  verifyKeyMiddleware,
  require("../controllers/imagesController")
);

// Feedback Logic
app.use(
  "/api/feedback/",
  verifyKeyMiddleware,
  require("../controllers/feedbackController")
);

/* Global error handling */
globalErrorHandler(app);

module.exports = app;
