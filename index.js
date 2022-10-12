const app = require("./server");
const dotenv = require("dotenv");
const connectToDB = require("./db");

/* Enable env variables to be available on process.env */
dotenv.config();

/*  Connect to MongoDB */
connectToDB();

/* Serving static files from "public" folder */
if (process.env.NODE_ENV === "production") {
  app.use(express.static("public"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on PORT: " + PORT));
