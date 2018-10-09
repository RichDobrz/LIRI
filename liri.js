require("dotenv").config();

var keys = require("./keys.js")
var request = require("request")
var moment = require("moment")
var Spotify = require("node-spotify-api")
var arg = process.argv[2]
var arg2 = process.argv[3]
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

// calls functions based on process.argv[2]
if (arg === "concert-this"){

    concertThis(arg2);

} else if (arg === "spotify-this-song") {
    
    spotifyThis(arg2);

} else if (arg === "movie-this") {
    
    movieThis(arg2);

} else if (arg === "do-what-it-says") {
    
    doWhatItSays(arg2);

}

function spotifyThis(arg2) {
    if(!arg2){
        arg2 = "The Sign"
    }
    
    //Spotify API search, returns track based on arg[3]
    spotify.search({
        type: "track",
        query: arg2
    }, function(err, data){
        if (err) {
            console.log("Error: " + err);
        }
        console.log("**************************")
        console.log("Artist: " + data.tracks.items[0].artists[0].name)
        console.log("Song: " + data.tracks.items[0].name)
        console.log("Preview: " + data.tracks.items[0].external_urls.spotify)
        console.log("Album: " + data.tracks.items[0].album.name)
        console.log("**************************")
    })
}

function concertThis(arg2){
    // creates request to bands in town and logs relevent info
    request("https://rest.bandsintown.com/artists/" + arg2 + "/events?app_id=codingbootcamp", function(error, response, body){
        console.log("**************************")
        console.log("Venue: " + JSON.parse(body)[0].venue.name)
        console.log("City: " + JSON.parse(body)[0].venue.city + ", " + JSON.parse(body)[0].venue.region)
        console.log("Date: " + moment(JSON.parse(body)[0].datetime).format("MMMM Do YYYY, h:mm a"))
        console.log("**************************")
    })
}

function movieThis(arg2){
   
    // if no argument is passed in argv[3] defaults to Mr Nobody
    if(!arg2) {
        arg2 = "Mr Nobody"
    }
   
    // creates request to OMDB and logs relevent returned data
    request("http://www.omdbapi.com/?apikey=trilogy&t=" + arg2, function(error, response, body){
        console.log("***************************")
        console.log(JSON.parse(body).Title)
        console.log("Released: " + JSON.parse(body).Year)
        console.log("IMDB Rating: " + JSON.parse(body).imdbRating)
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value)
        console.log("Country: " + JSON.parse(body).Country)
        console.log("Language: " + JSON.parse(body).Language)
        console.log("Plot: " + JSON.parse(body).Plot)
        console.log("Cast: " + JSON.parse(body).Actors)
        console.log("***************************")
    })
}

//function to read random.txt and run search function based on contents
function doWhatItSays(arg2) {
    
    fs.readFile("random.txt", "utf8", function(error, data){
        if(error){
            return console.log(error)
        }
        //creates new array from random.txt broken at commas and sets dataArr[1] to variable to pass as an argument
        var dataArr = data.split(",")
        var dataPass = dataArr[1].slice(1, -1)
        
        // calls functions based on dataArr[0]
        if(dataArr[0] === "spotify-this-song"){
            spotifyThis(dataPass)
        } else if (dataArr[0] === "movie-this") {
            movieThis(dataPass)
        } else if (dataArr[0] === "concert-this") {
            concertThis(dataPass)
        }
    })
}
