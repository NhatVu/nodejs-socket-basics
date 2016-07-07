var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('./public'));

io.on('connection', function(socket){
	console.log('User connected via socket.io!');

	socket.on('message', function(message){
		console.log('Server received: ' + message.text);

		//socket.broadcast.emit('message', message);
		io.emit('message', message);
	});

	socket.emit('message', {
		text: 'Welcome to chat application!'
	});
});

http.listen(port, function(){
	console.log('Server started!');
});