//Class variables
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var mongo = require('mongodb');
var port = process.env.PORT || 8080;
var database = require('./config/database');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var router = express.Router();

//Router configuration
app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
  //__dirname : It will resolve to your project folder.
});

//Configuration
mongoose.connect(database.url);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/app/views'))                 
app.use(morgan('dev'));                                         
app.use(bodyParser.urlencoded({'extended':'true'}));            
app.use(bodyParser.json());                                     
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(methodOverride());

//Routing
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

//Start application with node
app.listen(port);
console.log("App listening on port " + port);