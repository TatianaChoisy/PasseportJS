// Passport est un middleware d'authentification pour Node. Il est conçu pour servir un objectif unique: authentifier les demandes. Lors de l'écriture de modules, l'encapsulation est une vertu. Passport délègue toutes les autres fonctionnalités à l'application. Cette séparation des problèmes maintient le code propre et maintenable, et rend Passport extrêmement facile à intégrer dans une application.

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');

var configDB = require('./config/database.js');
mongoose.connect('mongodb://localhost/Anastasia');
require('./config/passport')(passport);

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));

app.use(passport.initialize());
app.use(passport.session()); // 
app.use(flash()); 




app.set('view engine', 'ejs');


require('./app/routes.js')(app, passport);

app.listen(port);
console.log('Server running on port: ' + port);


