var request = require('request');
var Twitter = require('twitter');
var Spotify = require('spotify');
var input = process.argv
var command = input[2];

//---------- Twitter 
function myTweets() {
    var authKeys = require("./keys.js");
    var client = new Twitter({
    consumer_key: authKeys.twitterKeys.consumer_key,
    consumer_secret: authKeys.twitterKeys.consumer_secret,
    access_token_key: authKeys.twitterKeys.access_token_key,
    access_token_secret: authKeys.twitterKeys.access_token_secret
});
   client.get('statuses/user_timeline', {count: 20}, function(error, tweets, response) {
        if (error) { 
            console.log(error); 
            return;
        } else {
            for (var i = 0; i < tweets.length; i++) {
                console.log("-----------------------------------------------------------------------------------------------------------------------------------");
                console.log("Tweet: " + tweets[i].text);
                console.log("Date: " + tweets[i].created_at.substr(0,19));
                console.log("-----------------------------------------------------------------------------------------------------------------------------------");
            } 
        }
    });
}

//-------- Spotify
function mySpotify() {
    var songQuery = [];
    for (var i = 3; i < input.length; i++) {
        songQuery.push(input[i]);
    }
    var spotifyQuery = songQuery.join(" ");
    if (input[3] == null) {
        spotifyQuery = "Ace of Base The Sign";
    };

    Spotify.search({ type: 'track', query: spotifyQuery }, function(err, data) {
        if ( err ) {
        console.log('Error occurred: ' + err); 
        return;
    } else if (input[3] == null) {
        console.log("\n\t!!! No song title requested. HERE'S ACE OF BASE !!!")
    }
        var songResult = data.tracks.items[0];
        console.log("\n*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*\n");
        console.log("\tArtist: " + songResult.artists[0].name);
        console.log("\tSong Title: " + songResult.name);
        console.log("\tPreview URL: " + songResult.preview_url);
        console.log("\tAlbum: " + songResult.album.name);
        console.log("\n*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*\n");
    });
}
//-------- OMDB
function myMovie() {
    var movieTitle;
    var url; 
    var actualTitle = [];

    function splitMovieTitle() {
        for (var i = 3; i < input.length; i++) {
            actualTitle.push(input[i]);
        };   return actualTitle;
    };
   
    if (input[3] == null || movieTitle == "undefined") {
            movieTitle = "mr+nobody";
            console.log("\n!!! No movie title found. HERE'S MR. NOBODY !!!");
     } else {
         splitMovieTitle();
         movieTitle = actualTitle.join('+').replace(/\'/g, "'");
     };

    url = "http://www.omdbapi.com/?t=" + movieTitle + "&tomatoes=true&r=json";

    request(url, function(error, response, body) {
        var movieInfo = JSON.parse(body);
        if (movieInfo.Response == "False") {
            console.log("-----ERROR-----")
            console.log(movieInfo.Error);
        } else {
        console.log("\n*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*\n");
        console.log("\tTitle: " + movieInfo.Title);
        console.log("\tYear Released: " + movieInfo.Year);
        console.log("\tCountry: " + movieInfo.Country);
        console.log("\tLanguage: " + movieInfo.Language);
        console.log("\tPlot: " + movieInfo.Plot);
        console.log("\tActors: " + movieInfo.Actors);
        console.log("\tIMDB Rating: " + movieInfo.Ratings[0].Value);
        console.log("\tRotten Tomatoes Rating: " + movieInfo.Ratings[1].Value);
        console.log("\tRotten Tomatoes URL: " + movieInfo.tomatoURL);
        console.log("\n*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*\n");
        }
    });
}
//------- random.txt
function randomText() {
    var fs = require("fs");
    var textFile = "random.txt";
    fs.readFile(textFile, "utf8", function(err, data) {
        if (err) {
            console.log(err);
        } else {
            var dataArray = data.split(",").join(" ").replace(/\"/g,"");
            var exec = require('child_process').exec;
            var cmd = 'node liri.js ' + dataArray;
            exec(cmd, function(error, output) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(output);
                }
});
        }
    })
}
//----- Run the app based on command
if (command === "my-tweets") {
    myTweets();
} else if (command === "spotify-this-song") {
    mySpotify();
} else if (command === "movie-this") {
    myMovie();
} else if (command === "do-what-it-says") {
    randomText();
}