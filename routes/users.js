var express = require("express");
var router = express.Router();

const bcryptjs = require("bcryptjs");
const bcrypt = require("bcryptjs/dist/bcrypt");
const passport = require("passport");

const User = require("../models/users");

/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log(req);
  res.send("respond with a resource");
});

//login authentication function of passort local statergy

router.post("/login", function (req, res, next) {
  console.log(req.body);
  if (req.user) {
    return res.send("user is already logged in");
  }
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      console.log(err, user, info);
      return res.status(401).json(err);
    }
    if (user) {
      console.log("user found and authenticated");
      console.log("use is ", user);
      req.login(user, function (err) {
        if (err) {
          console.log(err);
        }
        console.log("req username" + req.user);
        const user = {
          name: req.user.firstName + " " + req.user.lastName,
          username: req.user.username,
          id: req.user._id,
          timeStamp: Date.now(),
        };
        return res.send(user);
      });
    } else {
      res.status(401).json(info);
    }
  })(req, res, next);

  // res.send({ status: "success", data: "No such data as of now" });
});

// signup function add new users to the database

router.post("/signup", async (req, res, next) => {
  console.log(req.body);
  try {
    await User.findOne({ username: req.body.username }).then(async (doc) => {
      console.log("this is document that is being retrived", doc);
      if (doc) {
        res.send("user already exist");
      }
      if (!doc) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        console.log("req body containd this", req.body);
        const user = await User.create(req.body);

        res.status(201).json({
          success: true,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;

// logout using the local method

router.get("/logout", (req, res, next) => {
  if (!req.user) {
    res.send("no user has logged in");
  } else {
    req.logout();
    res.status(200).json({
      success: true,
      text: "logged out successfully",
    });
  }
});
