const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../model/user");

router.get("/", (req, res) => {
  res.redirect("https://quiet-river-09568.herokuapp.com/login");
});
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.clearCookie("test_jwt", { path: "/" });
      return res.redirect("https://quiet-river-09568.herokuapp.com/login");
    } else {
      //user is present here
      //password check
      if (user.password !== password) {
        res.clearCookie("test_jwt", { path: "/" });
        return res.redirect("https://quiet-river-09568.herokuapp.com/login");
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

        // res.render("dashboard", { name: user.name });
        res.redirect("https://quiet-river-09568.herokuapp.com/dashboard");
      }
    }
  } catch (error) {
    console.log(error);
    res.redirect("https://quiet-river-09568.herokuapp.com/login");
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
    expiresIn: "20000",
  });

  res.cookie("test_jwt", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2,
    path: "/",
  });
  res.redirect("https://quiet-river-09568.herokuapp.com/dashboard");
});

router.get("/dashboard", async (req, res) => {
  try {
    const decodeToken = jwt.verify(req.cookies.test_jwt, "lifeiseasy");
    console.log(decodeToken);
    if (!decodeToken || decodeToken === "" || decodeToken === null) {
      res.clearCookie("test_jwt", { path: "/" });
      res.redirect("https://quiet-river-09568.herokuapp.com/login");
    } else {
      const user = await User.findById(decodeToken.id);
      res.render("dashboard", { name: user.name });
    }
  } catch (error) {
    if (error.message === "jwt expired") {
      res.clearCookie("test_jwt", { path: "/" });
      res.redirect("https://quiet-river-09568.herokuapp.com/login");
    }
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("test_jwt", { path: "/" });
  res.redirect("https://quiet-river-09568.herokuapp.com/login");
});
module.exports = router;
