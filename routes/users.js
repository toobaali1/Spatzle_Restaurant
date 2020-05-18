const express = require("express");
const passport = require("passport");
const User = require("../models/user");

const router = express.Router();

// show sign up form
router.get("/register", (req, res) => {
    res.render("userAuthViews/register");
});

// Register a new user 
router.post("/register", (req, res) => {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            return res.render("userAuthViews/register");
        }

        // logs the user in
        passport.authenticate("local")(req, res, () => {
            res.redirect("/items");
        });
    });
});

// show login form
router.get("/login", (req, res) => {
    res.render("userAuthViews/login");
});

// Login existing user
router.post("/login", passport.authenticate("local", {
    successRedirect: "/items",
    failureRedirect: "/login"
}), (req, res) => {

});

// Logout User
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/items");
});

// show admin dashboard
router.get("/admin/dashboard", (req, res) => {
    res.render("itemViews/adminItems");
});

// show admin page
router.get("/admin/login", (req, res) => {
    res.render("userAuthViews/admin");
});

// sign in as admin
router.post("/admin/login", passport.authenticate("local", {
    successRedirect: "/admin/dashboard",
    failureRedirect: "/admin"
}), (req, res) => {

});


module.exports = router;
