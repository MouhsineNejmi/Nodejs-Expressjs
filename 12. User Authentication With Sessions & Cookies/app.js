require("dotenv").config();

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const app = express();

const users = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.render("form");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (username) {
      req.session.user = { id: uuidv4(), username, password: hashedPassword };
      return res.redirect("/profile");
    }
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/profile", (req, res) => {
  if (req.session.user) {
    res.render("profile", { username: req.session.user.username });
  } else {
    res.redirect("/");
  }
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.listen(4000, () => console.log("Server running on port 4000"));
