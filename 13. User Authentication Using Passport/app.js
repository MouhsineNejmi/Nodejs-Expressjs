require("dotenv").config();

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { comparePasswords } = require("./helpers/helpers.js");

const app = express();

const users = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Configure session management
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  const user = users.filter((user) => user.id === id);
  done(null, user);
});

app.get("/", (req, res) => {
  res.render("form");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (username) {
      const user = { id: uuidv4(), username, password: hashedPassword };
      req.session.user = user;
      users.push(user);
      return res.redirect("/profile");
    }
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    (username, password, done) => {
      const user = users.filter((user) => user.username === username);

      if (comparePasswords(password, user.password)) {
        done(null, user);
      } else {
        done(null, false);
      }
    }
  )
);

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
