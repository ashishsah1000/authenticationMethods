var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const passport = require("passport");

const connectDatabase = require("./config/database");
const passportConfig = require("./auth/passportConfig");

var app = express();

app.set("trust proxy", 1); // trust first proxy
var store = new MongoDBStore({
  uri: "mongodb://localhost:27017/authentication_store_session",
  collection: "mySessions",
});
// connecting to database
connectDatabase();

// Catch errors
store.on("error", function (error) {
  console.log(error);
});

app.use(
  session({
    name: "SESS_NAME",
    secret: "SESS_SECRET",
    store: store,
    saveUninitialized: true,
    resave: false,
    cookie: {
      // secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60,
    },
  })
);

const options = {
  credentials: true,
  origin: "http://localhost:3001",
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
};
app.use(cors(options));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.authenticate("session"));
require("./auth/passportConfig")(passport);

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
