const bcryptjs = require("bcryptjs");
const req = require("express/lib/request");
const res = require("express/lib/response");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/users");

module.exports = function (passport) {
  //   console.log("inside the authentication function");
  passport.use(
    new localStrategy((username, password, done) => {
      User.findOne({ username: username })
        .then((user) => {
          if (!user) return done(null, false);
          //   console.log(user);
          else {
            bcryptjs.compare(password, user.password, (err, result) => {
              // console.log("result=", result);
              if (err) throw err;
              if (result === true) {
                return done(null, user);
              } else {
                return done(null, false);
              }
            });
          }
        })
        .catch((err) => console.log(err));
    })
  );
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  passport.deserializeUser((user, cb) => {
    console.log("from deserialization of user", user);
    User.findOne({ username: user.username })
      .then((user) => {
        console.log("inside desearlize user", user);
        cb(null, user);
      })
      .catch((err) => {
        console.log(err);
        cb(null, false, { error: err });
      });
  });
};
