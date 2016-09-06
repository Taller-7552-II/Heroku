var express = require('express');
var app = express();

app.set('port',process.env.PORT || 3000);

app.get('/', function(request, response) {
	response.send("super");
});

app.get('/july', function(request, response) {
	response.send("epic");
});

app.listen(app.get('port'), function(){
	console.log('Jobify working, kill it with Ctrl-C');
});