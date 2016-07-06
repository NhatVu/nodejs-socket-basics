var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static('./public'));

http.listen(port, function(){
	console.log('Server started!');
})