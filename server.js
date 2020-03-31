const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/user");
const posts = require("./routes/api/post");
const profiles = require("./routes/api/profile");

const app = express();

const db = require("./config/keys").mongoURI;

mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch(error => console.log(error));

app.get("/", (req, res) => res.send("Hello"));

app.use("/api/user", users);
app.use("/api/post", posts);
app.use("/api/profile", profiles);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
