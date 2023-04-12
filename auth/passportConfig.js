const bcryptjs = require("bcryptjs");
const req = require("express/lib/request");
const res = require("express/lib/response");
const localStrategy = require("passport-local").Strategy;
const user = require("../models/users");

module.exports = function (passport) {
  //   console.log("inside the authentication function");
  passport.use(
    new localStrategy((username, password, done) => {
      user
        .find({ username: username })
        .then((user) => {
          console.log("from the user of passport js ", user);
          if (!user) return done(null, false);
          //   console.log(user);
          user = user[0];
          bcryptjs.compare(password, user.password, (err, result) => {
            // console.log("result=", result);
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );
  passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });
  passport.deserializeUser((id, cb) => {
    users.find({ _id: id }, (err, user) => {
      if (err) {
        cb(null, false, { error: err });
      } else {
        cb(null, user);
      }
    });
  });
};
