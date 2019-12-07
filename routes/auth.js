var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Invites = require('../models/invites');
var config = require('../config');

var router = express.Router();

router.post('/register', function (req, res) {
  var requestBody = req.body;
  var password = requestBody.password;
  var passwordRe = requestBody.passwordRe;

  User.getUserByEmail(requestBody.email, function (err, user) {
    if (!user) {
      if (password === passwordRe && requestBody.email && requestBody.firstName && requestBody.lastName) {
        Invites.getInviteeByEmail(requestBody.email, function (err, invitee) {
          if (err) throw err;

          var newUser = new User({
            email: requestBody.email,
            password: requestBody.password,
            firstName: requestBody.firstName,
            lastName: requestBody.lastName,
            isNewUser: true,
            sharedUsers: []
          });

          if (invitee) {
            newUser.sharedUsers = invitee.shared;
          }

          User.createUser(newUser, function (err, user) {
            if (err) throw err;

            res.send(user).end();
          });
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

router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: config.BaseUrl + '/socialLoginSuccess',
    failureRedirect: config.BaseUrl + '/login'
  })
);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: config.BaseUrl + '/login'
  }),
  function (req, res) {
    res.redirect(config.BaseUrl + '/socialLoginSuccess');
  }
);

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
  console.log(req.user)
  console.log(req.isAuthenticated())
  if (req.isAuthenticated()) {
    res.status(200).send().end();
  } else {
    res.status(401).send().end();
  }
});

module.exports = router;
