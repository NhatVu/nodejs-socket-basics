var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static('./public'));

var clientInfo = {}
/**
 * Send current users to provided socket
 * @param  {[type]} socket [description]
 * @return {[type]}        [description]
 */
function sendCurrentUsers(socket){
	var info = clientInfo[socket.id];
	var users = []
	if(typeof info === 'undefined')
		return;

	Object.keys(clientInfo).forEach(function(socketId){
		var userInfo = clientInfo[socketId];
		if(userInfo.room === info.room){
			users.push(userInfo.name);
		}

		socket.emit('message', {
			name: 'System',
			text: 'Current users: ' + users.join(', '),
			timestamp: moment.valueOf()
		});
	})

}

io.on('connection', function(socket) {

	console.log('User connected via socket.io!');

	socket.on('disconnect', function() {
		var userData = clientInfo[socket.id];
		if (typeof userData.room !== 'undefined') {
			socket.leave(userData);
			socket.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left!',
				timestamp: moment.valueOf()
			});
			// after leave room, remove this sokcet from the clientInfo
			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function(req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has join',
			timestamp: moment.valueOf()
		});
	});

	socket.on('message', function(message) {
		console.log('Server received: ' + message.text);
		console.log(message);
		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		} else {
			message.timestamp = moment.valueOf();
			io.to(clientInfo[socket.id].room).emit('message', message);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to chat application!',
		timestamp: moment.valueOf()
	});
});

http.listen(port, function() {
	console.log('Server started!');
});