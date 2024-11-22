var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");

var usersRouter = require("./routes/users");
var loginRouter = require("./routes/login");
var quizzesRouter = require("./routes/quizzes");

var app = express();

app.use(
  session({
    secret: "FdzvG2o9cXl42OYocqurNNonhObVfaIf",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/login", loginRouter);
app.use("/users", usersRouter);
app.use("/quizzes", quizzesRouter);

module.exports = app;
