var keys = require('./keys.js');
var twitter = require('twitter');
var spotify = require ('spotify');
var request = require('request');
var fs = require('fs');

var method = process.argv[2];
var nodeArgs= process.argv;


var client = new twitter({
	consumer_key: keys.twitterKeys.consumer_key,
	consumer_secret: keys.twitterKeys.consumer_secret,
	access_token_key: keys.twitterKeys.access_token_key,
	access_token_secret: keys.twitterKeys.access_token_secret
});

if (method === 'my-tweets'){
	var twitterparams = {screen_name: 'EricTheZuck', count: '20', trim_user: true};
	client.get('statuses/user_timeline', twitterparams, function(error, tweets, response){
		if (!error) {
			for (i = 0; i<tweets.length; i++){
				console.log('--------TWEET--------' );
				console.log(tweets[i].text);
				console.log(tweets[i].created_at);
				console.log('---------------------');
			};	
		}
		else{
			console.log(error);
		};
	});
};

if (method === 'spotify-this-song'){
	var songArgs = nodeArgs.slice(3);
	var songName = '';  
	if (songArgs.length < 1){
		songName = "All That She Wants";
	}
	else{
		songName = songArgs.join(' ');
	};
	spotify.search({type: 'track', query: songName}, function(err, data){
		if (err){
			console.log(err);
		}
		else{
			console.log('----------' + data.tracks.items[0].name + '----------');
			console.log('Artist: ' + data.tracks.items[0].artists[0].name);
			console.log('Preview Link: ' + data.tracks.items[0].external_urls.spotify);
			console.log('Album: ' + data.tracks.items[0].album.name);
			console.log('--------------------------------')
		};
	});
};

if (method === 'movie-this'){
	var movieArgs = nodeArgs.slice(3);
	var movieName = '';
	if (movieArgs.length < 1){
		movieName = "Mr. Nobody"
	};
	for (i=0; i<movieArgs.length; i++){
		if (i>0 && i<movieArgs.length){
			movieName = movieName + '+' + movieArgs[i];
		}
		else{
			movieName = movieName + movieArgs[i];
		};
	};
	request('http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&tomatoes=true&r=json', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('---------- ' + JSON.parse(body)["Title"] + ' ----------')
			console.log('Year: ' + JSON.parse(body)["Year"]);
			console.log('IMDB Rating: ' + JSON.parse(body)["imdbRating"]);
			console.log('Country: ' + JSON.parse(body)["Country"]);
			console.log('Language: ' + JSON.parse(body)["Language"]);
			console.log('Plot: ' + JSON.parse(body)["Plot"]);
			console.log('Actors: ' + JSON.parse(body)["Actors"]);
			console.log('Tomato Meter: ' + JSON.parse(body)["tomatoMeter"]);
			console.log('Rotten Tomatoes URL: ' + JSON.parse(body)["tomatoURL"]);
			console.log('-------------------------------------')

		};
	});
};

if (method === 'do-what-it-says'){
	fs.readFile('random.txt', 'utf8', function(err, data){
	
	var dataArray = data.split(',');
	method = dataArray[0];
	songName = dataArray[1];
});
};

