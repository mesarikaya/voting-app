'use strict';

var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
//var mongo = require('mongodb');
var routes = require('./App/index.js');
var bodyParser = require('body-parser');
var ejs = require("ejs");

//Introduce packages for oAuth
var passport = require('passport');
//var GoogleAuth = require('google-auth-library');
//var auth = new GoogleAuth;
//var client = new auth.OAuth2(process.env.CLIENT_ID, '', '');

var app = express();
require('dotenv').load();
require('./config/passport')(passport);

// Connection URL
var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/voting-app';

//Connect to the databse
mongoose.connect(url);
mongoose.Promise = global.Promise;

// Configure
app.use(express.static(process.cwd() + "/Controllers"));
app.use(express.static(process.cwd() + "/Public"));
app.set('views', __dirname + '/Public/views');
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
//app.use(express.logger());
//app.use(express.cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.methodOverride());

app.use(session({
	secret: 'my_precious',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
//app.use(app.router);
//app.use(express.static(__dirname + '/public'));


app.use(passport.initialize());
app.use(passport.session());

//call the app
routes(app, passport);
    
var port = process.env.PORT || 8080;

    
app.listen(port, function() {
        console.log('Node.js listening on port ' + port);
});

