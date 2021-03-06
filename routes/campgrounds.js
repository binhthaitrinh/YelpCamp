var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended: true}));
var methodOverride = require("method-override");
router.use(methodOverride("_method"));
var middleware = require("../middleware"); //special name: index.js. So don't need index.js after middleware/

var NodeGeocoder = require("node-geocoder");
var options = {
	provider: "google",
	httpAdapter: "https",
	apiKey: "AIzaSyCm1N_zK6G8romD92bWh1bJ82WlNhcTcVo",
	formatter: null
};

var geocoder = NodeGeocoder(options);


//INDEX - show all campgrounds
router.get("/", function(req, res) {
	
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampGrounds) {
		if (err) {
			console.log(err);
		}
		else {
			res.render("campgrounds/index", {campgrounds:allCampGrounds});
		}
	});
	// res.render("campgrounds", {campgrounds:campgrounds});
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var price = req.body.price;
	console.log(req.body.location);
	geocoder.geocode(req.body.location, function(err, data) {
		console.log(data);
		if (err || !data.length) {
			req.flash("error", "Invalid address");
			return res.redirect("back");
		}
		var lat = data[0].latitude;
		var lng = data[0].longitude;
		var location = data[0].formattedAddress;
		var newCampground = {name: name, image: image, description: desc, author: author, price: price, location: location, lat: lat, lng: lng};
	
		// Create a new campground an d save to DB
		Campground.create(newCampground, function(err, newlyCreated) {
			if (err) {
				console.log(err);
			}
			else {
				res.redirect("campgrounds");
			}
		});
	});
		// campgrounds.push(newCampground);
		// get data from form and add to campground array
		// redirect back to campgrounds page
		// res.redirect("campgrounds");
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

//SHOW - show more info about one campground
router.get("/:id", function(req, res) {
	//find campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err || !foundCampground) {
			req.flash("error", "Campground not found!");
			res.redirect("back");
		}
		else {
			console.log(foundCampground);
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});

	// res.send("THIS WILL BE THE SHOW PAGE ONE DAY!");
});



// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
	// is user logged in
	
		Campground.findById(req.params.id, function(err, foundCampground) {
			res.render("campgrounds/edit", {campground: foundCampground});
		});
	
	//if not, redirect
	
});

// UPDATE COMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	geocoder.geocode(req.body.location, function(err, data) {
		if (err || !data.length) {
			req.flash("error", "Invalid address");
			return res.redirect("back");
		}
		req.body.campground.lat = data[0].latitude;
		req.body.campground.lng = data[0].longtitude;
		Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if (err) {
			req.flash("error", err.message);
			res.redirect("/campgrounds");
		}
		else {
			req.flash("success", "Successfully Updated!");
			res.redirect("/campgrounds/" + req.params.id);
		}
		});
	});
	//find and update correct campground
	
	//redirect somewhere
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect("/campgrounds");
		}
		else {
			res.redirect("/campgrounds");
		}
	})
});


//middleware


// function checkCampgroundOwnership(req, res, next) {
	
// };


module.exports = router;