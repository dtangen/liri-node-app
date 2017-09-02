//Declaring variables and required files
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var twitter = require("twitter");
var Spotify = require("node-spotify-api");
var userInput = process.argv[2];
var userData = process.argv[3];

//---------------------------------------------------------------
if (userInput === "my-tweets") {
	myTweets();
} else if (userInput === "spotify-this-song") {	
	spotifyThisSong();
} else if (userInput === "movie-this") {	
	movieThis();
} else if (userInput === "do-what-it-says") {
	doWhatItSays();
}
//----------------------------------------------------------------

//Function to get my tweets
function myTweets() {
	var client = new twitter({
			consumer_key: keys.twitterKeys.consumer_key,
			consumer_secret: keys.twitterKeys.consumer_secret,
			access_token_key: keys.twitterKeys.access_token_key,
			access_token_secret: keys.twitterKeys.access_token_secret, 
		});
		params = {screen_name: "dtBootCamp",
					count: 20};
		client.get("statuses/user_timeline/", params, function(error, data, response){
			if (!error) {
				for(var i = 0; i < data.length; i++) {
					var twitterResults = 
					"@" + data[i].user.screen_name + ": " + 
					data[i].text + "\n" + 
					data[i].created_at + "\n" + 
					"------------------------------ " + (i + 1) + " ------------------------------" + "\n";
					console.log(twitterResults);
				}
			}  else {
				console.log("Error :"+ error);
				return;
			}
		});
}
//Function to get song info from Spotify
var songTitle = userData;

function spotifyThisSong(songTitle) {

var spotify = new Spotify({
  id: keys.spotifyKeys.id,
  secret: keys.spotifyKeys.secret
});

	if(!songTitle){
		songTitle = "The Sign";
	}

	params = songTitle;
	spotify.search({ type: "track", query: params }, function(err, data) {
		if(!err){
			var songInfo = data.tracks.items;
			for (var i = 0; i < 1; i++) {
				if (songInfo[i] != undefined) {
					var spotifyResults =
					"Artist: " + songInfo[i].artists[0].name + "\n" +
					"Song: " + songInfo[i].name + "\n" +
					"Preview Url: " + songInfo[i].preview_url + "\n" + 
					"Album the song is from: " + songInfo[i].album.name + "\n" +
					"------------------------------ " + (i + 1) + " ------------------------------" + "\n";
					console.log(spotifyResults);
				}
			}
		}	else {
			console.log("Error :"+ err);
			return;
		}
	});
}
//Function to get movie info from OMDB
function movieThis() {
	var movieTitle = userData;
	if(!movieTitle){
			movieTitle = "mr nobody";
		}
		params = movieTitle
		request("http://www.omdbapi.com/?t=" + params + "&y=&plot=short&apikey=40e9cece", function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var movieObject = JSON.parse(body);
				var movieResults =
				"-------------------------------Movie Info--------------------------------" + "\n" +
				"Title: " + movieObject.Title+"\n"+
				"Year: " + movieObject.Year+"\n"+
				"Imdb Rating: " + movieObject.imdbRating+"\n"+
				"Rotten Tomatoes Rating: " + movieObject.Ratings[1].Value+"\n"+
				"Country: " + movieObject.Country+"\n"+
				"Language: " + movieObject.Language+"\n"+
				"Plot: " + movieObject.Plot+"\n"+
				"Actors: " + movieObject.Actors+"\n";
				console.log(movieResults);
			} else {
				console.log("Error :"+ error);
				return;
			}
		});
}
//Function to get text from random.txt
function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data){
			if (!error) {
				doWhatItSaysResults = data.split(",");
				spotifyThisSong(doWhatItSaysResults[1]);
			} else {
				console.log("Error occurred" + error);
			}
		});
}