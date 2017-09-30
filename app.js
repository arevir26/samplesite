var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


var initializer = require('./variableinitializer')
var index = require('./routes/index');
var users = require('./routes/users');
var layout = require('./routes/layout');
var category = require('./routes/category');
var moviepanel = require('./routes/moviepanel');
var resultpage =require('./routes/results');
var expressvalidator = require('express-validator');
var watch =require('./routes/watch');
var login = require('./routes/login');
var checkSession = require('./routes/include/checkSession');

var app = express();
app.locals.script = "http://localhost:3000/javascripts/bootstrap.min.js";
app.locals.style = "http://localhost:3000/stylesheets/bootstrap.css";
app.locals.dbname = "webdb.sqlite3";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(initializer);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressvalidator());
app.use(session({secret:"Ryan Joseph",resave:false,saveUninitialized:false}));


app.use(checkSession.isLoggedIn);
app.use('/', index);
app.use('/users', users);
app.use('/layout',layout);
app.use('/category',category);
app.use('/moviepanel',moviepanel);
app.use('/movies',resultpage);
app.use('/watch',watch);
app.use('/admin',login);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
