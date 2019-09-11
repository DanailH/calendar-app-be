var createError = require('http-errors');
var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var Strategy = require('./models/passport');
var User = require('./models/user');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var holidayRouter = require('./routes/holiday');

var app = express();

var db = mongoose.connection;
mongoose.connect('mongodb://admin:admin123@ds137019.mlab.com:37019/calendar-app', {
  useNewUrlParser: true
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to mLab db');
});

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
passport.use(Strategy);

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));
app.use(express.urlencoded({ extended: false }));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

// API endpoints
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/holiday', holidayRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
