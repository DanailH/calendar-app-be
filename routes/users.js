var express = require('express');
var User = require('../models/user');
var router = express.Router();

router.get('/user', function(req, res) {
  console.log(req.session)
  if (!req.session.passport) {
    res.send(401).end();
  }

  var userId = req.session.passport.user;
  // var userId = req.query.userId;

  User.getUserById(userId, function (err, user) {
    if (err) throw err;

    res.send({
      email: user.email,
      firstName: user.firstName,
      isNewUser: user.isNewUser,
      lastName: user.lastName,
      _id: user._id
    }).end();
  });
});

router.put('/user', function(req, res) {
  console.log(req.session)
  if (!req.session.passport) {
    res.send(401).end();
  }

  var userId = req.session.passport.user;
  // var userId = req.query.userId;

  User.getUserById(userId, function (err, user) {
    if (err) throw err;

    User.updateUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isNewUser: user.isNewUser
    }, function (err, user) {
      if (err) throw err;

      res.send(user).end();
    });
  })
});

router.post('/shareCalendar', function(req, res) {
  if (!req.session.passport) {
    res.send(401).end();
  }

  var userId = req.session.passport.user;
  var targetUserEmail = req.body.targetUserEmail;

  User.getUserByEmail(targetUserEmail, function(err, user) {
    if (err) throw err;
      console.log(user)
    if (user) {
      user.sharedUsers.push(userId);

      User.updateUser(user, function (err, user) {
        if (err) throw err;

        res.send(200).end();
      });
    } else {
      res.statusMessage = "No user found";
      res.status(404).end();
    }
  })
});


module.exports = router;
