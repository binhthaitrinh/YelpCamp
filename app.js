var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var flash = require("connect-flash");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("./models/user");
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/index");
var methodOverride = require("method-override");
mongoose.connect("mongodb+srv://binhthaitrinh:<Kakak2k@>@cluster0-i4sco.mongodb.net/yelp_camp?retryWrites=true");

app.use(methodOverride("_method"));
app.use(flash());

app.use(express.static(__dirname+ "/public"));

// seedDB();	//seed database


// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//currentUser will be available on every route (ejs)
app.use(function(req, res, next) {
	  res.locals.currentUser = req.user;
	  //whatever we put in res.locals is available inside template. avoid passing currentUser to all route
	  res.locals.error = req.flash("error");	//pass "message" to every route
	  res.locals.success = req.flash("success");
	  next();
});

app.use(authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


// mongoose.connect('mongodb://localhost/yelp_camp_4', {useNewUrlParser: true});

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

var port = process.env.PORT || 3000;

app.listen(port, process.env.IP, function() {
	console.log("YelpCamp has Started!");
});
