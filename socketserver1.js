// Use the http module: http://nodejs.org/api/http.html
var app = require('express');
var https = require('https');
// var https = require('https');
var fs = require('fs');
var url =  require('url');

var options = {
  key: fs.readFileSync('my-key.pem'),
  cert: fs.readFileSync('my-cert.pem')
};


// Call the createServer method, passing in an anonymous callback function that will be called when a request is made
var httpServer = https.createServer(options,handleIt);
// var recognition = new webkitSpeechRecognition();



// Tell that server to listen on port 8081
// var httpServer = http.createServer(options, requestHandler);

httpServer.listen(8000); 

// http://nodejs.org/api/http.html#http_event_request
function handleIt(req, res) {
	console.log("The URL is: " + req.url);

	//req is an IncominMessage: http://nodejs.org/api/http.html#http_http_incomingmessage
	//res is a ServerResponse: http://nodejs.org/api/http.html#http_class_http_serverresponse
	//res.writeHead(200, {'Content-Type': 'text/html'});
	//res.end('<html><body><b>Hello World</b></body></html>\n');

	var parsedUrl = url.parse(req.url);
	console.log("They asked for " + parsedUrl.pathname);

	var path = parsedUrl.pathname;
	if (path == "/") {
		path = "index1.html";
	}

	fs.readFile(__dirname + path,

		// Callback function for reading
		function (err, fileContents) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + req.url);
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(fileContents);
  		}
  	);	
	
	// Send a log message to the console
	console.log("Got a request " + req.url);
}

 

console.log('Server listening on port 8000');

//////////////////////////


var clients = [];
var usernames = {};

//array of all lines drawn
var line_history = [];

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {

	

		console.log("We have a new client: " + socket.id);

		socket.on('score', function(data) {
			console.log(data);
		});

//////////////////ADD USER NAME//////////////
		socket.on('adduser', function(username){
		// store the username in the socket session for this client
		socket.username = username;
		// store the room name in the socket session for this client
		// socket.room = 'room1';
		// add the client's username to the global list
		usernames[username] = username;
		// send client to room 1
		// socket.join('room1');
		// echo to client they've connected
		// socket.emit('chatMessage', 'SERVER', username + ', you have connected to Counseling Chatroom');
		// socket.broadcast.emit('chatMessage', 'SERVER', username + '  has connected to this room');
		// socket.emit('updaterooms', rooms, 'room1');
		});



		// // When this usr emits, client side: socket.emit('otherevent',some data);
		// socket.on('chatMessage', function(data) {
		// // Data comes in as whatever was sent, including objects
		// console.log("We have a new client: " + socket.id);
			
		// // Send it to all of the clients
		// io.sockets.emit('chatMessage', socket.username, data);

  //     	console.log(data.docSentiment.score);

		// // socket.broadcast.emit('chatMessage', socket.username, data);
			
		// });
		
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
		
		
		socket.on('peerid', function(data) {
			//io.sockets.emit("peerid", data);
			socket.broadcast.emit('peerid', data);

			for (var c = 0; c < 2; c++) {

				socket.emit('peerid',clients[c]);
			}

			clients.push(data);
		});

	}




);




