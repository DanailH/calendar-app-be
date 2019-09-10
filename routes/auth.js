var express = require('express');
var passport = require('passport');
var User = require('../models/user');

var router = express.Router();

router.post('/register', function (req, res) {
  var password = req.body.password;
  var passwordRe = req.body.passwordRe;

  if (password == passwordRe) {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password
    });

    User.createUser(newUser, function(err, user) {
      if(err) throw err;

      res.send(user).end();
    });
  } else {
    res.status(401).send("{errors: \"Passwords don't match\"}").end();
  }
});

router.post('/login',
  passport.authenticate('local'),
  function (req, res) {
    res.send(req.user);
  }
);

router.get('/logout', function (req, res) {
  req.logout();
  res.send(null);
});

router.get('/isAuth', function (req, res) {
  if (req.isAuthenticated()) {
    res.status(200).send().end();
  } else {
    res.status(401).send().end();
  }
});

module.exports = router;
