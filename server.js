let express  = require('express'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	flash = require('connect-flash')
	bodyParser = require('body-parser');
	cookieParser = require('cookie-parser');
	session = require('express-session');
	http = require('http')

let app  = express()
const port     = process.env.PORT || 8080
const configDB = 'mongodb://localhost/anastasia'

mongoose.connect(configDB)

require('./config/database') //



app.use(cookieParser()); // cookies pour l'authentification
//app.use(bodyParser.urlencoded()); // interprète la forme du html
//app.use(express.session({ secret: '' })); // session secrète
app.use(passport.initialize());
app.use(passport.session()); // persiste la connexion à la session
app.use(flash()); // utilisé pour flasher les messages stockés dans la session


app.set('view engine', 'ejs');


require('./app/routes.js')(app, passport)

// app.listen(8080);
// console.log('Server running on port: ' + port);


http.createServer(app).listen(8080);