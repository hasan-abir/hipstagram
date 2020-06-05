const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const verifyKey = require("./middlewares/verifyKey");

dotenv.config();

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/auth/", verifyKey, require("./routes/auth"));
app.use("/api/images/", verifyKey, require("./routes/images"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running"));
