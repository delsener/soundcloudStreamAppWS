var sc = require("../utils/soundcloudUtils.js");
var async = require("async");

// favorites stream
exports.getFavorites = function(app, req, res) {
	sc.get("/users/" + req.params.profile + "/favorites", {limit:100}, function (error, favorites) {
		console.log("number of tracks: " + favorites.length);
		res.json(favorites);
	});
};

// news stream
exports.getStream = function(app, req, res) {
	sc.get("/users/" + req.params.profile + "/followings", {limit:100}, function (error, followings) {
		var followingsFavorites = [];
		var count = 0;
		
		async.whilst(
		    function () {
		    	// if (count < followings.length) {
		    	if (count <= 10) {
		    		return true;
		    	}
		    	return false; 
		    },
		    function (callback) {
		    	sc.get("/users/" + followings[count].id + "/favorites", {limit:5}, function (error, favorites) {
		    	  followingsFavorites = followingsFavorites.concat(favorites);
      			  count++;
      			  callback();
      		  });
		    },
		    function (err) {
		    	console.log(followingsFavorites);
		    	res.json(followingsFavorites);
		    }
		);
	});
};