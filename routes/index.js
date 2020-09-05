const express = require('express'),
    router = express.Router({ mergeParams: true });
const passport = require("passport");
const User = require("../models/user");
const class_name = require('../models/class');
router.get("/register", function (req, res) {
    res.render("register");
});
//handle sign up logic
router.post("/register", function (req, res) {
    var class_nam = { text: req.body.class_name };
    console.log(class_nam);

    var newUser = new User({ username: req.body.username, class_name: req.body.class_name });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/notes");
        });
    });
});

// show login form
router.get("/login", function (req, res) {
    res.render("login", { message: req.flash("error") });
});
// handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/notes",
        failureRedirect: "/login"
    }), function (req, res) {
    });

// logic route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "You are logged out succefully")
    res.redirect("/");
});

module.exports = router;