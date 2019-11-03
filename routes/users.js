var express = require('express');
var User = require('../models/user');
var Invites = require('../models/invites');
var emailer = require('../emailer');
var router = express.Router();

router.get('/user', function(req, res) {
  if (!req.session.passport) {
    res.send(401).end();
  }

  var userId;

  if (req.query.userId) {
    userId = req.query.userId;
  } else {
    userId = req.session.passport.user;
  }


  User.getUserById(userId, function (err, user) {
    if (err) throw err;

    res.send({
      email: user.email,
      firstName: user.firstName,
      isNewUser: user.isNewUser,
      lastName: user.lastName,
      sharedUsers: user.sharedUsers,
      _id: user._id
    }).end();
  });
});

router.put('/user', function(req, res) {
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
    if (user) {
      if (user.sharedUsers) {
        user.sharedUsers.push(userId);
      } else {
        user.sharedUsers = [userId];
      }

      User.updateUser(user, function (err, user) {
        if (err) throw err;

        emailer.transporter.sendMail({
          from: 'team@foiz.io',
          to: user.email,
          subject: `${req.user.firstName} has shared their calendar with you!`,
          html: emailer.setTemplate(req.user.firstName, req.user.lastName)
        }, function (error, info) {
          if (error) {
            throw error;
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

        res.send(200).end();
      });
    } else {
      Invites.getInviteeByEmail(targetUserEmail, function (err, invitee) {
        if (err) throw err;

        if (invitee) {
          if (invitee.shared.includes(userId)) {
            res.send(200).end();
          } else {
            Invites.setInvitee({
              email: targetUserEmail,
              shared: invitee.shared.push(userId)
            }, function (err, invitee) {
              if (err) {
                res.send(400).end();
              } else {
                emailer.transporter.sendMail({
                  from: 'team@foiz.io',
                  to: targetUserEmail,
                  subject: `${req.user.firstName} has shared their calendar with you!`,
                  html: emailer.setTemplate(req.user.firstName, req.user.lastName)
                }, function (error, info) {
                  if (error) {
                    throw error;
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });

                res.send(200).end();
              }
            });
          }
        } else {
          Invites.setInvitee(new Invites({
            email: targetUserEmail,
            shared: [userId]
          }), function (err, invitee) {
            if (err) {
              res.send(400).end();
            } else {
              emailer.transporter.sendMail({
                from: 'team@foiz.io',
                to: targetUserEmail,
                subject: `${req.user.firstName} has shared their calendar with you!`,
                html: emailer.setTemplate(req.user.firstName, req.user.lastName)
              }, function (error, info) {
                if (error) {
                  throw error;
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

              res.send(200).end();
            }
          });
        }
      });
    }
  })
});


module.exports = router;
