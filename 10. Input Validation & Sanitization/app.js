require("dotenv").config();

const express = require("express");
const { body, validationResult } = require("express-validator");
const xss = require("xss");
const jwt = require("jsonwebtoken");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

let token = "";

// Routes
app.get("/", (req, res) => {
  res.render("index");
  res.setHeader("authorization", `Bearer ${token}`);
});

app.post(
  "/login",
  [
    body("username").notEmpty().trim(),
    body("password").isLength({ minLength: 6 }),
  ],
  (req, res) => {
    // Validate and authenticate the user
    // Implement appropriate validation and secure authentication mechanisms here
    // For simplicity, you can use a hardcoded username and password for demonstration purposes

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Sanitize the user input
    const { username, password } = req.body;
    const sanitizedData = {
      username: xss(username),
      password: xss(password),
    };

    // Generate a JWT with user's id
    token = jwt.sign({ username: username }, process.env.TOKEN_SECRET);

    if (
      sanitizedData.username === "admin" &&
      sanitizedData.password === "password"
    ) {
      res.redirect("/dashboard");
    } else {
      res.redirect("/");
    }

    res.status(200).json({ message: "Login successful", token: token });
  }
);

app.get("/dashboard", (req, res) => {
  // Secure the dashboard route to only allow authenticated users
  const authorizationHeader = req.headers["authorization"];

  console.log(authorizationHeader);
  // if (!authorizationHeader) {
  //   return res.redirect("/");
  // }

  token = authorizationHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userName = decoded.username;

    if (userName) {
      res.render("dashboard");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
