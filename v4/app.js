var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");

seedDB();


mongoose.connect('mongodb://localhost/yelp_camp_4', {useNewUrlParser: true});

// var campgrounds = [
// 	{name: "Salcom Creek", image:"https://stmed.net/sites/default/files/tengen-toppa-gurren-lagann-wallpapers-26134-4316625.jpg"},
// 	{name: "Granite Hill", image:"https://stmed.net/sites/default/files/tengen-toppa-gurren-lagann-wallpapers-26134-4316625.jpg"},
// 	{name: "Mountain", image:"https://stmed.net/sites/default/files/tengen-toppa-gurren-lagann-wallpapers-26134-4316625.jpg"},
// 	{name: "Salcom Creek", image:"https://stmed.net/sites/default/files/tengen-toppa-gurren-lagann-wallpapers-26134-4316625.jpg"}
// ];

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

//SCHEMA SETUP


// Campground.create({
// 	name: "Granite Hill",
// 	image:"https://stmed.net/sites/default/files/tengen-toppa-gurren-lagann-wallpapers-26134-4316625.jpg",
// 	description: "This is asijaoifa all aidgh algidlg idlg"
// }, function(err, campground) {
// 	if (err) {
// 		console.log(err);
// 	}
// 	else {
// 		console.log("NEWLY CREATED CAMPGROUND: ");
// 		console.log(campground);
// 	}
// });

app.get("/", function(req, res) {
	res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res) {
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampGrounds) {
		if (err) {
			console.log(err);
		}
		else {
			res.render("campgrounds/index", {campgrounds:allCampGrounds});
		}
	})
	// res.render("campgrounds", {campgrounds:campgrounds});
});

//CREATE - add new campground to DB
app.post("/campgrounds", function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};
	// Create a new campground an d save to DB
	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		}
		else {
			res.redirect("campgrounds");
		}
	})
	// campgrounds.push(newCampground);
	// get data from form and add to campground array
	// redirect back to campgrounds page
	// res.redirect("campgrounds");
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res) {
	res.render("campgrounds/new");
});

//SHOW - show more info about one campground
app.get("/campgrounds/:id", function(req, res) {
	//find campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		}
		else {
			console.log(foundCampground);
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});

	// res.send("THIS WILL BE THE SHOW PAGE ONE DAY!");
});


//=======================================
// COMMENT ROUTES
// ++++++++++++++++++++++++++++++++++++++

app.get("/campgrounds/:id/comments/new", function (req, res) {
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

app.post("/campgrounds/:id/comments", function(req, res) {
	//lookup campground using ID
	Campground.findById(req.params.id, function(err, campground) {
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else {
			Comment.create(req.body.comment, function(err, comment) {
				if(err){
					console.log(err);
				}
				else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
	//create new comment
	//connect new comment to camground
	//redirect campground show page
})

app.listen(3000, function() {
	console.log("YelpCamp has Started!");
});
