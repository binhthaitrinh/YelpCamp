var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCampground) {
			if(err || !foundCampground) {
				req.flash("error", "Campground not found");
				res.redirect("back");
			}
			else {
				//does user own campground?
				if ((foundCampground.author.id.equals(req.user._id)) || (req.user.isAdmin)) {
					next();
				}
				//else, redirect
				else {
					req.flash("error", "You dont have permission");
					res.redirect("back");
				}
				
			}
		});
	}
	else {
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if(err || !foundComment) {
				req.flash("error", "Comment not found");
				res.redirect("back");
			}
			else {
				//does user own campground?
				if ((foundComment.author.id.equals(req.user._id)) || (req.user.isAdmin)) {
					next();
				}
				//else, redirect
				else {
					req.flash("error", "you don't have permission!");
					res.redirect("back");
				}
				
			}
		});
	}
	else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	console.log(req.originalUrl);

	req.session.redirectTo = req.originalUrl;
	console.log(req.session.redirectTo);
	req.flash("error", "You need to be logged in first");

	res.redirect("/login");
};

module.exports = middlewareObj;