require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js")
var axios = require("axios");
var moment = require("moment")

// var input="Mr. Nobody"
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var action = process.argv[2];

var printInfo;

//using a switch will check what input the user entered and will call the relevant/associated function.
switch (action) {
  case "concert-this":
    var input;
    if (process.argv[3] === undefined) {
      console.log("enter artist name");
    }else {
      input = process.argv.slice(3).join("+")
      printInfo=("user has entered -- " + action + "  with -- " + input)
      concert(input);
    }

    break;

  case "spotify-this-song":
    var input;
    if (process.argv[3] === undefined) {
      input = "The Sign";
      getInfoFromSpotify(input);
    } else {
      input = process.argv.slice(3).join("+")
      printInfo=("user has entered -- " + action + "  with -- " + input)
      getInfoFromSpotify(input);
    }

    break;

  case "movie-this":
    var input;
    if (process.argv[3] === undefined) {
      input = "Mr. Nobody"
      movie(input);
    }
    else {
      input = process.argv.slice(3).join("+")
      printInfo=("User entered -- " + action + "  with -- " + input)
      movie(input);
    }
    break;

  case "do-what-it-says":
    says();

    break;
}

//this functions takes the user input if they enter concert-this which is then used in the bandsInTown API
function concert(infoFromUser) {
  axios.get("https://rest.bandsintown.com/artists/" + infoFromUser + "/events?app_id=" + process.env.BandsinTown_ID+ "").then(
    function (concertResults) {
    let results = (concertResults.data);
      for (var i = 0; i < results.length; i++) {
        eventVenueName = (results[i].venue.name)
        eventVenueCity = (results[i].venue.city)
        eventVenueCountry = (results[i].venue.country)
        eventDate = (results[i].datetime)
        location = (eventVenueCity + ", " + eventVenueCountry)

        //console.logs below give info back to the user based on what they entered
        var newDate = moment(eventDate).format('MM/DD/YYYY');
        console.log("The name of the venue where the event is located is: " + eventVenueName);
        console.log("The event location is: " + location);
        console.log("The event date is: " + newDate);
        // console.log("---------------New event---------------");
        venue = ("The event venue is called: " + eventVenueName);
        locationEvent = ("The event location is: " + location);
        date = ("The event date is: " + newDate);
        printInfo = ("\n" + "concert-this was entered" + "\n" + "Event searched for: --" + infoFromUser + "\n" + venue + "\n" + locationEvent + "\n" + date + "\n" + "-----------------------------" + "\n");
      }
    })
    
    .catch(function (error) {
      if (error.response) {
        // Request made, but the server responded with a code
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        // when the request was made but no response received
        console.log(error.request);
      } else {
        // something triggered an error and we want to see what it is
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}
//this takes the input from the user when they enter, spotify-this-song, it then uses the node spotify API
function getInfoFromSpotify(inputFromSearch) {
  spotify
    .search({ type:'track', query:inputFromSearch })
    .then(function (response) {
      for (let i = 0; i < response.tracks.items.length; i++) {
        artistName = response.tracks.items[i].album.artists[0].name;
        songName = response.tracks.items[i].name;
        urlPreview = response.tracks.items[i].preview_url;
        albumName = response.tracks.items[i].album.name;

        artist = ("Artist: " + artistName);
        song = ("Song: " + songName);
        url = ("spotify url link: " + urlPreview);
        album = ("album: " + albumName);

        console.log("Artist: " + artistName);
        console.log("Song: " + songName);
        console.log("spotify url link: " + urlPreview);
        console.log("album: " + albumName);
        // console.log("---------------New Album---------------");

        printInfo = ("\n" + "spotify-this-song was entered" + "\n" + "Song searched for: --" + songName + "\n" + artist + "\n" + url + "\n" + album + "\n" + "-----------------------------" + "\n");
      };
    })

    .catch(function (error) {
      if (error.response) {
        // Request made, but the server responded with a code
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        // when the request was made but no response received
        console.log(error.request);
      } else {
        // something triggered an error and we want to see what it is
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

// this function will take the input from user entering movie-this and then will use the omdb API
function movie(inputToSearch) {
  if (inputToSearch === undefined) {
    var movieName = "Mr. Nobody"
    console.log("please enter a movie!");
  }else { var movieName = inputToSearch }
  var omdbApi = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey="+process.env.Omdb_APIKEY+"";
  axios.get(omdbApi).then(
    function (movieResults) {
      let results = movieResults.data;
      movieTitle = results.Title;
      movieYear = results.Year;
      movieIMDBRating = results.imdbRating;
      movieRottenRating = results.Ratings[1].Value;
      movieCountryProduced = results.Country;
      movieLanguage = results.Language;
      moviePlot = results.Plot;
      movieActors = results.Actors;

      var title = ("Movie title: " + movieTitle);
      var release = ("Release year: " + movieYear);
      var iMDBRating = ("Rating: " + movieIMDBRating + " on IMDB");
      var rottenRating = ("Rating: " + movieRottenRating + " on Rotten Tomatoes");
      var country = ("Country produced in: " + movieCountryProduced);
      var language = ("Available in: " + movieLanguage);
      var plot = ("Plot: " + moviePlot);
      var actors = ("Actors in the movie: " + movieActors);

      console.log("Movie title: " + movieTitle);
      console.log("Release year: " + movieYear);
      console.log("Rating: " + movieIMDBRating + " on IMDB");
      console.log("Rating: " + movieRottenRating + " on Rotten Tomatoes");
      console.log("Country produced in: " + movieCountryProduced);
      console.log("Available in: " + movieLanguage);
      console.log("Plot: " + moviePlot);
      console.log("Actors in the movie: " + movieActors);
      printInfo = ("\n" + "movie-this was entered" + "\n" + "Movie searched for: --" + movieName + "\n" + title + "\n" + release + "\n" + iMDBRating + "\n" + rottenRating + "\n" + country + "\n" + language + "\n" + plot + "\n" + actors + "\n" + "-----------------------------" + "\n")
      // console.log(printInfo);
      log(printInfo)
    })
    .catch(function (error) {
      if (error.response) {
        // Request made, but the server responded with a code
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        // when the request was made but no response received
        console.log(error.request);
      } else {
        // something triggered an error and we want to see what it is
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

//this function takes the user input if they enter do-what-it-says, then runs the text in random.txt
function says() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    data = data.split(", ")
    var action = data[0]
    var inputFromTxtfile = data[1]
    switch (action) {
      case "concert-this":
        concert(inputFromTxtfile);
        break;

      case "spotify-this-song":
        getInfoFromSpotify(inputFromTxtfile);
        break;

      case "movie-this":
        movie(inputFromTxtfile);
        break;
    };
  });
}