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
app.use(function(req, res, next) {
	
	exports.optionsCB = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT');
		
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
	}
	
	
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
	       
	       var loco = "result: "+JSON.stringify(result.rows)+" "+JSON.stringify(result.rows.length);
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
//TODAS LAS CATEGORYS
//TODAS LAS CATEGORYS

//PUT Category POSITIONS
var pg = require('pg');

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.put('/categories/:problem', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
	
	 var comilla = '\'';
	client.query("select * from skills where category = "+comilla+request.params.problem+comilla, function(err, resultSkills) {
      done();
      if (err)
		{ console.error(err); response.send("Error " + err); }
      else
       {
	   
	   if(resultSkills.rows.length <1){
		   client.query("select * from jobs  where category = "+comilla+request.params.problem+comilla, function(err, resultJobs) {
		  done();
		  if (err)
			{ console.error(err); response.send("Error " + err); }
		  else
		   {
		   
		   if(resultJobs.rows.length <1){
					   
			var query = "UPDATE categories set name = "+comilla+request.body.category.name+comilla+" ,";
			query = query +" description = "+comilla+request.body.category.description+comilla+" ,";

			  query = query + " where name = "+comilla +request.params.problem+comilla;

			client.query(query, function(err, result) {
			  done();
			  if (err)
			   { console.error(err); response.send("Error " + err); }
			  else
			   {

					   

				var rta =  "{ \"category\": {";
				rta = rta + "\"name\": \""+request.body.category.name+ "\" , ";
				
				rta = rta + "\"description\": \""+request.body.category.description+"\" , ";
				rta = rta + "}}";

				 rta = rta.replace(/\\/g , "");
				 response.write(rta); 
				response.end(); }
				});
		   
		   }
		   else{
		   
		   
		   response.write("Job Position usada");
		   response.end();
		   }
		   }
		   });
	   }
	   else{
	     
	   response.write("Skill usada");
	   response.end();
	   }
	   }
    
    });
  });
});




//DELETE CATEGORY
var pg = require('pg');

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.delete('/categories/:problem', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
	
	 var comilla = '\'';
	client.query("select * from skills where category = "+comilla+request.params.problem+comilla, function(err, resultSkills) {
      done();
      if (err)
		{ console.error(err); response.send("Error " + err); }
      else
       {
	   
	   if(resultSkills.rows.length <1){
		   client.query("select * from jobs  where category = "+comilla+request.params.problem+comilla, function(err, resultJobs) {
		  done();
		  if (err)
			{ console.error(err); response.send("Error " + err); }
		  else
		   {
		   
		   if(resultJobs.rows.length <1){
					   
					var query = "delete from categories where name = "+comilla+request.params.problem+comilla;
				  
				client.query(query, function(err, result) {
				  done();
				  if (err)
				   { console.error(err); response.send("Error " + err); }
				  else
				   {
					response.status(204);
						 response.write(""); 
						response.end(); }
						});		   
		   }
		   else{
		   
		   
		   response.write("Job Position usada");
		   response.end();
		   }
		   }
		   });
	   }
	   else{
	     
	   response.write("Skill usada");
	   response.end();
	   }
	   }
    
    });
  });
});

//post CATEGORY POSITIONS
var pg = require('pg');

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.post('/categories', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
   
    var comilla = '\'';
    client.query('insert into categories values('+comilla+request.body.category.name+comilla+','+comilla+request.body.category.description+comilla+')' , function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       {
	     response.status(201);
	     var rta = "  \"category\": {\"name\": \""+request.body.category.name+"\",\"description\": \""
	     rta = rta+request.body.category.description+"\"}";
	         rta = rta.replace(/\\/g , "");
	         response.write(rta); 
       		response.end(); }
    });
  });
});


//GET CATEGORY POSITIONS
var pg = require('pg');

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.get('/categories', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
    var num = request.url.toString().substring(26, request.url.toString().length);
    var comilla = '\'';
    client.query('SELECT * FROM categories ' , function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       {
	       
	       var rta = "{ \"categories\": "+JSON.stringify(result.rows);
	       rta = rta+",\"metadata\": { \"version\": \"0.1\",\"count\": "+JSON.stringify(result.rows.length)+"}}";
	         rta = rta.replace(/\\/g , "");
	         response.write(rta); 
       		response.end(); }
    });
  });
});

//TODOS LOS  SKILLS
//PUT JOB POSITIONS
var pg = require('pg');

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.put('/skills/categories/:problem/:nombre', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
	  
    var comilla = '\'';
	  
    var query = "UPDATE skills set name = "+comilla+request.body.skills.name+comilla+" ,";
    query = query +" description = "+comilla+request.body.skills.description+comilla+" ,";
	  query = query +" category = "+comilla+request.body.skills.category+comilla;
	  query = query + " where name = "+comilla +request.params.nombre+comilla+" and ";
	  query = query + "category = "+comilla+request.params.problem+comilla;
	  
    client.query(query, function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       {
	       
	       

	var rta =  "{ \"skills\": {";
        rta = rta + "\"name\": \""+request.body.skills.name+ "\" , ";
    
	rta = rta + "\"description\": \""+request.body.skills.description+"\" , ";
	rta = rta + "\"category\": \""+request.body.skills.category+"\" }}";
	       
	         rta = rta.replace(/\\/g , "");
	         response.write(rta); 
       		response.end(); }
    });
  });
});

//DELETE JOB POSITIONS
var pg = require('pg');

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.delete('/skills/categories/:problem/:nombre', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
	  
    var comilla = '\'';
	  
    var query = "DELETE from skills where name = "+comilla +request.params.nombre+comilla+" and ";
	  query = query + "category = "+comilla+request.params.problem+comilla;
	  
    client.query(query, function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       {
	       
	       var rta = "{ \"skills\": ";
	         rta = rta.replace(/\\/g , "");
	       response.status(204);
	         response.write(query); 
       		response.end(); }
    });
  });
});
//GET JOB POSITIONS
var pg = require('pg');

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.get('/skills/categories/:problem', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
    var num = request.url.toString().substring(26, request.url.toString().length);
    var comilla = '\'';
    client.query('SELECT * FROM skills where category = '+comilla+request.params.problem+comilla , function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       {
	       
	       var rta = "{ \"skills\": "+JSON.stringify(result.rows);
	       rta = rta+",\"metadata\": { \"version\": \"0.1\",\"count\": "+JSON.stringify(result.rows.length)+"}}";
	         rta = rta.replace(/\\/g , "");
	         response.write(rta); 
       		response.end(); }
    });
  });
});
//post JOB POSITIONS
var pg = require('pg');

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.post('/skills/categories/:problem', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
   
    var comilla = '\'';
    client.query('insert into skills values('+comilla+request.body.skills.name+comilla+','+comilla+request.body.skills.description+comilla+','+comilla+request.params.problem+comilla+')' , function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       {
	     response.status(201);
	     var rta = "  \"skills\": {\"name\": \""+request.body.skills.name+"\",\"description\": \""
	     rta = rta+request.body.skills.description+"\",\"category\": \""+request.params.problem+"\"}";
	         rta = rta.replace(/\\/g , "");
	         response.write(rta); 
       		response.end(); }
    });
  });
});
//GET JOB POSITIONS
var pg = require('pg');

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.get('/skills', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
    var num = request.url.toString().substring(10, request.url.toString().length);
    var comilla = '\'';
    client.query('SELECT * FROM skills', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       {
	       
	       var rta = "{ \"skills\": "+JSON.stringify(result.rows);
	       rta = rta+",\"metadata\": { \"version\": \"0.1\",\"count\": "+JSON.stringify(result.rows.length)+"}}";
	         rta = rta.replace(/\\/g , "");
	         response.write(rta); 
       		response.end(); }
    });
  });
});

//TODOS LOS  SKILLS
//PUT JOB POSITIONS
var pg = require('pg');

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.put('/job_positions/categories/:problem/:nombre', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
	  
    var comilla = '\'';
	  
    var query = "UPDATE jobs set name = "+comilla+request.body.job_position.name+comilla+" ,";
    query = query +" description = "+comilla+request.body.job_position.description+comilla+" ,";
	  query = query +" category = "+comilla+request.body.job_position.category+comilla;
	  query = query + " where name = "+comilla +request.params.nombre+comilla+" and ";
	  query = query + "category = "+comilla+request.params.problem+comilla;
	  
    client.query(query, function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       {
	       
	       

	var rta =  "{ \"job_positions\": {";
        rta = rta + "\"name\": \""+request.body.job_position.name+ "\" , ";
    
	rta = rta + "\"description\": \""+request.body.job_position.description+"\" , ";
	rta = rta + "\"category\": \""+request.body.job_position.category+"\" }}";
	       
	         rta = rta.replace(/\\/g , "");
	         response.write(rta); 
       		response.end(); }
    });
  });
});

//DELETE JOB POSITIONS
var pg = require('pg');

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.delete('/job_positions/categories/:problem/:nombre', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
	  
    var comilla = '\'';
	  
    var query = "DELETE from jobs where name = "+comilla +request.params.nombre+comilla+" and ";
	  query = query + "category = "+comilla+request.params.problem+comilla;
	  
    client.query(query, function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       {
	       
	       var rta = "{ \"job_positions\": ";
	         rta = rta.replace(/\\/g , "");
	       response.status(204);
	         response.write(query); 
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
//post JOB POSITIONS
var pg = require('pg');

var connectionString = "postgres://nlmbufkijzqmqs:2BESGXz_KTUisRfo4MmdoJBNid@ec2-54-235-254-199.compute-1.amazonaws.com:5432/d36ea1inur7hrd";
app.post('/job_positions/categories/:problem', function (request, response) {

  pg.defaults.ssl = true;
  pg.connect(connectionString, function(err, client, done) {
  	if (err)
       { console.error('Rompio loco',err);}
   
    var comilla = '\'';
    client.query('insert into jobs values('+comilla+request.body.job_position.name+comilla+','+comilla+request.body.job_position.description+comilla+','+comilla+request.params.problem+comilla+')' , function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       {
	     response.status(201);
	     var rta = "  \"job_position\": {\"name\": \""+request.body.job_position.name+"\",\"description\": \""
	     rta = rta+request.body.job_position.description+"\",\"category\": \""+request.params.problem+"\"}";
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
	   response.sendFile('index.html');
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
