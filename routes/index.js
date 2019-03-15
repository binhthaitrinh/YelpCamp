var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

var bodyParser = require("body-parser");


router.get("/", function(req, res) {
	res.render("landing");
});


router.use(bodyParser.urlencoded({extended: true}));



//=========================
// AUTH ROUTES
//=========================

// show register form
router.get("/register", function(req, res) {
	res.render("register");
});

router.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if(err){
			req.flash("error", err.message);
			return res.redirect("register");
		}
		passport.authenticate("local")(req,res,function() {
			req.flash("success", "Welcome to YelpCamp" + user.username);
			res.redirect("/campgrounds");
		});
	});
});

// LOGIN LOGIC
router.get("/login", function(req, res) {
	res.render("login");
});

//handling login logic
//app.post("/login", middleware, callback);
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res) {
		// req.flash("success", "Welcome" + req.body.username);
});


// LOGOUT
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "logged you out!");
	res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
};


module.exports = router;