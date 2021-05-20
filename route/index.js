const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../model/user");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.clearCookie("test_jwt", { path: "/" });
      return res.redirect("http://localhost:3000/login");
    } else {
      //user is present here
      //password check
      if (user.password !== password) {
        res.clearCookie("test_jwt", { path: "/" });
        return res.redirect("http://localhost:3000/login");
      } else {
        //user and password are coorect assign a token
        const token = jwt.sign({ id: user._id }, "lifeiseasy", {
          expiresIn: "20000",
        });
        res.cookie("test_jwt", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 2,
          path: "/",
        });

        res.render("dashboard", { name: user.name });
      }
    }
  } catch (error) {
    console.log(error);
    res.redirect("http://localhost:3000/login");
  }
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = new User({
    name,
    email,
    password,
  });
  await newUser.save();
  const token = jwt.sign({ id: newUser._id }, "lifeiseasy", {
    expiresIn: "10000",
  });

  res.cookie("test_jwt", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2,
    path: "/",
  });
  res.redirect("http://localhost:3000/dashboard");
});

router.get("/dashboard", (req, res) => {
  try {
    const decodeToken = jwt.verify(req.cookies.test_jwt, "lifeiseasy");
    if (!decodeToken || decodeToken === "") {
      res.clearCookie("test_jwt", { path: "/" });
      res.redirect("http://localhost:3000/login");
    } else {
      res.send("Welcome");
    }
  } catch (error) {
    if (error.message === "jwt expired") {
      res.clearCookie("test_jwt", { path: "/" });
      res.redirect("http://localhost:3000/login");
    }
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("test_jwt", { path: "/" });
  res.redirect("http://localhost:3000/login");
});
module.exports = router;
