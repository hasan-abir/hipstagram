const app = require("./server");
const dotenv = require("dotenv");
const connectToDB = require("./db");
const express = require("express");
const path = require("path");

/* Enable env variables to be available on process.env */
dotenv.config();

/*  Connect to MongoDB */
connectToDB();

/* Serving static files from "dist" folder */
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on PORT: " + PORT));
