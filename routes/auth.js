var express = require('express');
var passport = require('passport');
var User = require('../models/user');

var router = express.Router();

router.post('/register', function (req, res) {
  var requestBody = req.body;
  var password = requestBody.password;
  var passwordRe = requestBody.passwordRe;

  User.getUserByEmail(requestBody.email, function (err, user) {
    if (!user) {
      if (password === passwordRe && requestBody.email && requestBody.firstName && requestBody.lastName) {        
        var newUser = new User({
          email: requestBody.email,
          password: requestBody.password,
          firstName: requestBody.firstName,
          lastName: requestBody.lastName
        });

        User.createUser(newUser, function (err, user) {
          if (err) throw err;

          res.send(user).end();
        });
      } else {
        res.statusMessage = "All fields required, please check and try again.";
        res.status(401).end();
      }
    } else {
      res.statusMessage = "This email already exists.";
      res.status(401).end();
    }
  })
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
