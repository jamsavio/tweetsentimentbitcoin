// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var sentimentos = []
httpServer.listen(8888);

function requestHandler(req, res) {
	// Read index.html
	fs.readFile(__dirname + '/queijo.html', 
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading canvas_socket.html');
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
}

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
	
		console.log("We have a new client: " + socket.id);
		
		// When this user emits, client side: socket.emit('otherevent',some data);
		socket.on('othermouse', function(data) {
			// Data comes in as whatever was sent, including objects
			console.log("Received: 'othermouse' " + data);
			socket.broadcast.emit('othermouse', data);
			
			// calcular media do velocimetro
			var media = 0;
			if(sentimentos.length < 300){
				sentimentos.push(data);
				socket.broadcast.emit('velocimetro_porcentagem',99);
			}else{
				sentimentos.shift();
				sentimentos.push(data);
				
				for (var i=0; i < sentimentos.length; i++){
					media+=parseFloat(sentimentos[i]);
				}
				
				media=media/sentimentos.length;
				socket.broadcast.emit('velocimetro_porcentagem',media);
			}
	
		});
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);
