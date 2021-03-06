var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var bodyParser = require("body-parser");

// For reset password
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
// For reset password

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

// handle sign up logic
router.post("/register", function(req, res) {
	var newUser = new User(
		{
			username: req.body.username, 
			firstName: req.body.firstName, 
			lastName: req.body.lastName,
			avatar: req.body.avatar,
			email: req.body.email
		});
	
	if (req.body.adminCode === "secretcode123") {
		newUser.isAdmin = true;
	}
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
// router.post("/login", passport.authenticate("local", 
// 	{
// 		successRedirect: "/campgrounds",
// 		failureRedirect: "/login",
// 		successFlash: "Welcome"
// 	}), function(req, res) {
// 		// req.flash("success", "Welcome" + req.body.username);

// });

router.post("/login", function(req, res, next) {
	passport.authenticate("local", function(err, user, info) {
		// set req.session.redirectTo here if you want to redirect somewhere
		// req.session.redirectTo = "/";
		
		console.log(req.path);
		if (err) {
			return next(err);
		}
		if (!user) {
			req.flash("error", "Invalid username or password");
			return res.redirect("/login");
		}
		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}
			console.log(req.session.redirectTo);
			// let redirectTo = null;
			// if (req.session.redirectTo) {
			// 	redirectTo = req.session.redirectTo;
			// }
			// else {
			// 	redirectTo = "campgrounds";
			// }
			let redirectTo = req.session.redirectTo ? req.session.redirectTo : "campgrounds";
			delete req.session.redirectTo;
			req.flash("success", "Welcome back " + user.username);
			res.redirect(redirectTo);
		});
	})(req, res, next);
});



// LOGOUT
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "logged you out!");
	res.redirect("/campgrounds");
});


// USER PROFILE
router.get("/users/:id", function(req, res) {
	User.findById(req.params.id, function(err, foundUser) {
		if (err) {
			req.flash("error", "Something went wrong.");
			res.redirect("/");
		}
		Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds) {
			if (err) {
				req.flash("error", "Something went wrong.");
				res.redirect("/");
			}
			res.render("users/show", {user: foundUser, campgrounds: campgrounds});
		});
		
	});
});

// forgot password
router.get("/forget", function(req, res) {
	res.render("forgot");
})


module.exports = router;