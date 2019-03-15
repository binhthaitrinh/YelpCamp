var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
//=======================================
// COMMENT ROUTES
// ++++++++++++++++++++++++++++++++++++++


//Comments new
router.get("/new", middleware.isLoggedIn, function (req, res) {
	//find campground by id
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err){
			console.log(err);
		}
		else {
			res.render("comments/new", {campground: foundCampground});
		}
	});
	
});


//Comments create
router.post("/", middleware.isLoggedIn, function(req, res) {
	//lookup campground using ID
	Campground.findById(req.params.id, function(err, campground) {
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else {
			Comment.create(req.body.comment, function(err, comment) {
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				}
				else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();


					campground.comments.push(comment);
					campground.save();
					// console.log(comment);
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
	//create new comment
	//connect new comment to camground
	//redirect campground show page
});

// EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err || !foundCampground) {
			req.flahs("error", "No campground found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment) {
		if(err) {
			res.redirect("back");
		}
		else {
			res.render("comments/edit", {campground_id: req.params.id, comment:foundComment});
		}
	});
	});
	
	
});

//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.redirect("back");
		}
		else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if(err) {
			res.redirect("back");
		}
		else {
			req.flash("success", "comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


// function checkCommentOwnership(req, res, next) {
	
// };


//middleware
// function isLoggedIn(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		return next();
// 	}
// 	res.redirect("/login");
// };

module.exports = router;