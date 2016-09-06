var http= require('http');
var express = require('express');
var app = express();

var server = http.createServer(function(req,res){
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end('<h1>Hola</h1>');
});
var port = Number(process.env.PORT || 3000);
server.listen(port);

app.get('/july', function(request, response) {
	response.send("epic");
}