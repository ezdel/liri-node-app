var keys = require('./keys.js');
var twitter = require('twitter');
var spotify = require ('spotify');
var request = require('request');
var fs = require('fs');

var method = '';
var name = '';
var nodeArgs= process.argv;


var client = new twitter({
	consumer_key: keys.twitterKeys.consumer_key,
	consumer_secret: keys.twitterKeys.consumer_secret,
	access_token_key: keys.twitterKeys.access_token_key,
	access_token_secret: keys.twitterKeys.access_token_secret
});
function checkMethod(){
	if (process.argv[2] === 'do-what-it-says'){
		fs.readFile('random.txt', 'utf8', function(err, data){
			var dataArray = data.split(',');
			method = dataArray[0];
			name = dataArray[1];
			return method;
			return name;
		});
	}
	else{
		method = process.argv[2];
		return method;
	};
};
checkMethod();

	switch (method){
	case 'my-tweets':
	var twitterparams = {screen_name: 'EricTheZuck', count: '20', trim_user: true};
	client.get('statuses/user_timeline', twitterparams, function(error, tweets, response){
		if (!error) {
			for (i = 0; i<tweets.length; i++){
				console.log('--------TWEET--------' );
				console.log(tweets[i].text);
				console.log(tweets[i].created_at);
				console.log('---------------------');
				fs.appendFile('log.txt', tweets[i].text + ' ' + tweets[i].created_at + ' ');	
			};	
		};
	});
	break;

	case 'spotify-this-song':
	console.log(method);
	var songArgs = nodeArgs.slice(3);
	if (name.length > 0){
		name = name;
	}
	else if (songArgs.length < 1){
		name = "All That She Wants";
	}
	else{
		name = songArgs.join(' ');
	};
	spotify.search({type: 'track', query: name}, function(err, data){
		if (err){
			console.log(err);
		}
		else{
			console.log('----------' + data.tracks.items[0].name + '----------');
			console.log('Artist: ' + data.tracks.items[0].artists[0].name);
			console.log('Preview Link: ' + data.tracks.items[0].external_urls.spotify);
			console.log('Album: ' + data.tracks.items[0].album.name);
			console.log('--------------------------------')
			fs.appendFile('log.txt', 'Song: ' + data.tracks.items[0].name + ' ' + 'Artist: ' + data.tracks.items[0].artists[0].name + ' ' + 'Preview Link: ' + data.tracks.items[0].external_urls.spotify + ' ' + 'Album: ' + data.tracks.items[0].album.name + ' ');
		};
	});
	break;

	case 'movie-this':
	var movieArgs = nodeArgs.slice(3);
	if (movieArgs.length < 1){
		name = "Mr. Nobody"
	};
	for (i=0; i<movieArgs.length; i++){
		if (i>0 && i<movieArgs.length){
			name = name + '+' + movieArgs[i];
		}
		else{
			name = name + movieArgs[i];
		};
	};
	request('http://www.omdbapi.com/?t=' + name + '&y=&plot=short&tomatoes=true&r=json', function (error, response, body) {
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
			fs.appendFile('log.txt', 'Title: ' + JSON.parse(body)["Title"] + ' ' + 'Year: ' + JSON.parse(body)["Year"] + ' ' + 'IMDB Rating: ' + JSON.parse(body)["imdbRating"] + ' ' + 'Country: ' + JSON.parse(body)["Country"] + ' ' + 'Language: ' + JSON.parse(body)["Language"] + ' ' + 'Plot: ' + JSON.parse(body)["Plot"] + ' ' + 'Actors: ' + JSON.parse(body)["Actors"] + ' ' + 'Tomato Meter: ' + JSON.parse(body)["tomatoMeter"] + ' ' + 'Rotten Tomatoes URL: ' + JSON.parse(body)["tomatoURL"] + ' ');
		};
	});
	break;
};

