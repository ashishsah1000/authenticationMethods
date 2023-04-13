var express = require("express");
const passport = require("passport");
var router = express.Router();
var passort = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log(req.user);
  res.status(200).json({
    status: "success",
    user: req.user,
  });
});

module.exports = router;
