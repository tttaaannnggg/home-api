require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const db = require("./db.controller.js");
const blogController = require("./blog.controller")(db);
const authController = require("./auth.controller")(db);

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static("../home/build"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.send(err);
});

app.get("/login", authController.login);
app.get("/validate", authController.validate, (req, res) =>
  res.json("got auth")
);
app.post("/api/posts", authController.validate, blogController.create);

app.get("/api/posts/:id", blogController.readById);
app.post("/api/posts/:id", authController.validate, blogController.updateById);

app.listen(port, () => console.log(`listening on ${port}`));
