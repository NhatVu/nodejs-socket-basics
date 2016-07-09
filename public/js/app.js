var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

console.log(name + ' name to join ' + room);

// Update room name
jQuery('.room-title').text(room);
var socket = io();

socket.on('connect', function() {
	console.log('Connected to socket.io server');

	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

socket.on('message', function(message) {
	var momentTimestamp = moment.utc(message.timestamp);
	var $message = jQuery('.messages');
	console.log('New message');
	console.log(message.text);

	$message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
	$message.append('<p>' + message.text + '</p>')
});

// handler submitting of new message

var $form = jQuery("#message-form");


$form.on('submit', function(event) {
	var $message = $form.find('input[name=message]');
	event.preventDefault();
	socket.emit("message", {
		name: name,
		text: $message.val()
	});

	$message.val('');

});