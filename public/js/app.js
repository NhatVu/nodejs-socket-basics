var socket = io();

socket.on('connect', function() {
	console.log('Connected to socket.io server');
});

socket.on('message', function(message) {
	console.log('New message');
	console.log(message.text);

	jQuery('.messages').append('<p>' + message.text + '</p>')
});

// handler submitting of new message
$(document).ready(function() {
	var $form = jQuery("#message-form");
	
	console.log('document is ready');
	$form.on('submit', function(event) {
		var $message = $form.find('input[name=message]');
		event.preventDefault();
		socket.emit("message", {
			text: $message.val()
		});
		
		$message.val('');

	});

});