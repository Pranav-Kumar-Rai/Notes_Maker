const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const myModule = require('./models/upload');
const app = express();
const Comment = require('./models/comment');
const upload = myModule.otherMethod;
const notesRoutes = require('./routes/notes');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/index');
const User = require("./models/user");
const flash = require('connect-flash');

const passport = require("passport"),
  LocalStrategy = require("passport-local");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

app.use(require("express-session")({
  secret: "Just trying to learn webD",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(express.static(__dirname + "/public"));
app.use(notesRoutes);
app.use(commentRoutes);
app.use(authRoutes);



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
}







const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
