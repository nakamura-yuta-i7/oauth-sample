var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');



var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
 
//Twitter Appsにて取得したConsumer Key (API Key)とConsumer Secret (API Secret)を記述
var TWITTER_CONSUMER_KEY = "kt4b3fAGCZCSfhAICgMTCXu8l";
var TWITTER_CONSUMER_SECRET = "z9p0IA04HrpHYHq7NaXvWqf3lz9StvBCT0WSgsEvDqCbCh0i4d";
 
passport.serializeUser(function (user, done) {
		done(null, user);
});
 
passport.deserializeUser(function (obj, done) {
		done(null, obj);
});
 
passport.use(new TwitterStrategy({
				consumerKey: TWITTER_CONSUMER_KEY,
				consumerSecret: TWITTER_CONSUMER_SECRET,
				callbackURL: "http://127.0.0.1:3000/oauth/callback/" //Twitterログイン後、遷移するURL
		},
		function (token, tokenSecret, profile, done) {
				console.log(token, tokenSecret, profile);
				process.nextTick(function () {
						return done(null, profile);
				});
		}
));



var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var session = require('express-session');
app.use(session({
  genid: function(req) {
    return genUuid() // use UUIDs for session IDs 
  },
  secret: 'keyboard cat'
}));
function genUuid(callback) {
  if (typeof(callback) !== 'function') {
		var crypto = require('crypto');
    return uuidFromBytes(crypto.randomBytes(16));
  }
  crypto.randomBytes(16, function(err, rnd) {
    if (err) return callback(err);
    callback(null, uuidFromBytes(rnd));
  });
}
function uuidFromBytes(rnd) {
  rnd[6] = (rnd[6] & 0x0f) | 0x40;
  rnd[8] = (rnd[8] & 0x3f) | 0x80;
  rnd = rnd.toString('hex').match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);
  rnd.shift();
  return rnd.join('-');
}

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

var oauth = require('./routes/oauth');
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use('/oauth', oauth);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
