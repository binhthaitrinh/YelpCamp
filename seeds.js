var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
	{
		name: "Cloud's Rest",
		image: "https://assets.bigcartel.com/product_images/183133855/000000000.jpg",
		description: "blah blah blah"
	},
	{
		name: "Not over yet",
		image: "https://m.media-amazon.com/images/M/MV5BYTY4NDAwYTAtOTc3My00ZWM5LWE5MWEtOGM4OTUzM2E1YzM5XkEyXkFqcGdeQXVyNjMxNzQ2NTQ@._V1_.jpg",
		description: "blah blah blah"
	},
	{
		name: "Let's so buddy",
		image: "https://i.ytimg.com/vi/5EXFilTUiko/maxresdefault.jpg",
		description: "blah blah blah"
	}
]

function seedDB() {

	// Remove all campgrounds
	Campground.remove({}, function(err) {
	if (err) {
		console.log(err);
	}
	console.log("removed campgrounds");
	// add a few campgrounds
	data.forEach(function(seed) {
		Campground.create(seed, function(err, campground) {
			if(err) {
				console.log(err);
			}
			else {
				console.log("added a campground");
				// create a comment
				Comment.create(
				{
					text: "This place is greate, but I wish there was Internet",
					author: "Homer"
				}, function(err, comment) {
					if (err) {
						console.log(err);
					}
					else {
						campground.comments.push(comment);
						campground.save();
						console.log("Created new comment");
					}
					
				});

			}
		});
	});
	});
}

module.exports = seedDB;