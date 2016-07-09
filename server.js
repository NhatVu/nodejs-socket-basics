var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static('./public'));

io.on('connection', function(socket){
	debugger;
	console.log('User connected via socket.io!');

	socket.on('message', function(message){
		console.log('Server received: ' + message.text);
		console.log(message);
		message.timestamp = moment.valueOf();
		//socket.broadcast.emit('message', message);
		io.emit('message', message);
	});

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to chat application!',
		timestamp: moment.valueOf()
	});
});

http.listen(port, function(){
	console.log('Server started!');
});