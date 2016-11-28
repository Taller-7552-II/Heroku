var express = require('express');
var app = express();

app.disable('x-powered-by');

var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars',handlebars.engine);
app.set('view engine', 'handlebars');



//LEO LOS REQUEST POR PARAMETRO Y POR JSON
var bodyParser     =         require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Importo mas cosas 

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


//test db bastante jodido configurar pero funco... no cambiar mucho de esto
var pg = require('pg');

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.get('/db', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
    client.query('SELECT * FROM usuarios', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { 
	       
	       var loco = "result: "+JSON.stringify(result.rows)+" "+JSON.stringify(result.rows.length);;
	       loco = loco.replace(/\\/g , "");
	       response.write(loco); 
       		response.end();
       }
	    
    });
  });
});
//hago post para base de dato
var pg = require('pg');

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.post('/id', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
    client.query('SELECT * FROM usuarios where id='+request.body.id, function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.json(result.rows); }
    });
  });
});
//hago post para base de dato
var pg = require('pg');

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.get('/usuarios/:user', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
    var num = request.url.toString().substring(10, request.url.toString().length);
    var comilla = '\'';
    client.query('SELECT * FROM usuarios where usuario = '+comilla+num+comilla , function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.json(result.rows); }
    });
  });
});


//post JOB POSITIONS
var pg = require('pg');

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.post('/job_positions/categories/:problem', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
    var num = request.url.toString().substring(26, request.url.toString().length);
    var comilla = '\'';
    client.query('insert into test_table values('+request.body.name+','+request.body.description+','request.params.problem+')' , function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       {
	       
	       var rta = "{ \"job_positions\": "+JSON.stringify(result.rows);
	       rta = rta+",\"metadata\": { \"version\": \"0.1\",\"count\": "+JSON.stringify(result.rows.length)+"}}";
	         rta = rta.replace(/\\/g , "");
	         response.write(rta); 
       		response.end(); }
    });
  });
});
//GET JOB POSITIONS
var pg = require('pg');

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.get('/job_positions/categories/:problem', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
    var num = request.url.toString().substring(26, request.url.toString().length);
    var comilla = '\'';
    client.query('SELECT * FROM jobs where category = '+comilla+request.params.problem+comilla , function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       {
	       
	       var rta = "{ \"job_positions\": "+JSON.stringify(result.rows);
	       rta = rta+",\"metadata\": { \"version\": \"0.1\",\"count\": "+JSON.stringify(result.rows.length)+"}}";
	         rta = rta.replace(/\\/g , "");
	         response.write(rta); 
       		response.end(); }
    });
  });
});

//GET JOB POSITIONS
var pg = require('pg');

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.get('/job_positions', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
    var num = request.url.toString().substring(10, request.url.toString().length);
    var comilla = '\'';
    client.query('SELECT * FROM jobs', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       {
	       
	       var rta = "{ \"job_positions\": "+JSON.stringify(result.rows);
	       rta = rta+",\"metadata\": { \"version\": \"0.1\",\"count\": "+JSON.stringify(result.rows.length)+"}}";
	         rta = rta.replace(/\\/g , "");
	         response.write(rta); 
       		response.end(); }
    });
  });
});

//POSTEO HARD A BASE DE DATO

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.post('/HARDB', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
    client.query(''+request.body.query, function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { 
	      
	       var loco = "Result: "+request.body.query +" "+JSON.stringify(result.rows);
	      
	       response.write(loco); 
       		response.end();
       }
	    
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
