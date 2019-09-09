var express = require('express');
var passport = require('passport');
var User = require('../models/user');

var router = express.Router();

router.post('/register', function (req, res) {
  var password = req.body.password;

  var newUser = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.createUser(newUser, function(err, user) {
    if(err) throw err;

    res.send(user).end();
  });
});

router.post('/login',
  passport.authenticate('local'),
  function (req, res) {
    console.log(req)
    res.send(req.user);
  }
);

router.get('/logout', function (req, res) {
  req.logout();
  res.send(null);
});

module.exports = router;
