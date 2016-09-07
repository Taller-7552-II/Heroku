var express = require('express');
var app = express();

app.disable('x-powered-by');

var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars',handlebars.engine);
app.set('view engine', 'handlebars');

//Importo mas cosas 

app.use(require('body-parser').urlencoded({extended: true}));

var formidable = require('formidable');

var credentials = require('./credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret));

app.set('port',process.env.PORT || 3000);


app.use(express.static(__dirname + '/public'));

//Metodo get para ir a la ruta web del handlebars
app.get('/about', function(request, response) {
	response.render('about');
});

app.get('/contact', function(request, response) {
	response.render('contact',{csrf :'csrf token'});
});


//test db
var pg = require('pg');
var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.get('/db', function (request, response) {
  pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT * FROM usuarios', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('db', {results: result.rows} ); }
    });
  });
});

app.get('/gracias', function(request, response) {
	response.render('gracias');
});

app.post('/process',function(request,response){
	console.log('Form '+ request.query.form);
	console.log('Token '+ request.body._csrf);
	console.log('Email '+ request.body.email);
	console.log('Preguntas '+ request.body.ques);
	response.redirect(303, '/gracias');
});

app.get('/file-upload', function(request, response) {
	var now = new Date();
	response.render('file-upload',{
		year: now.getFullYear(),
		month: now.getMonth()
	});
});
//Si me pasan de una por url la data lo manejo distinto
app.post('/file-upload/:year/:month', function(request, response) {
	var form = new formidable.IncomingForm();
	form.parse(request,function(err,fields,file){
		if(err)
			return response.redirect(303,'/505');
		console.log('Received File');
		console.log(file);
		response.redirect(303,'/gracias');
	
	});
});

app.get('/', function(request, response) {
	response.render('home');
});

app.use(function(request, response,next) {
	console.log("Looking for URL: "+request.url);
	next();
});
//ERRORES 404 Y 500
app.use(function(request, response,next) {
	response.type('text/html');
	response.status(404);
	response.render('404');
	
});
app.use(function(err,request, response,next) {
	console.error(err.stack);
	response.status(500);
	response.render('500');
	
});



app.listen(app.get('port'), function(){
	console.log('Jobify working, kill it with Ctrl-C');
});