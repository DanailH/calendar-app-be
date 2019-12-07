var User = require('./user')
var Invites = require('./invites')
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('../config');

var LStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    User.getUserByEmail(email, function (err, user) {
      if (err) throw err;

      if (!user) {
        return done(null, false, {
          message: 'Unknown User'
        });
      }

      User.comparePassword(password, user.password, function (err, isMatch) {
        if (err) throw err;

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: 'Invalid password'
          });
        }
      });
    });
  }
);

var GStrategy = new GoogleStrategy({
    clientID: '731023738172-cgfhn2hf5dsbsp2b304d4i75iapbmo23.apps.googleusercontent.com',
    clientSecret: 'ps2oosOSFrq56ZpHpcSLX9j7',
    callbackURL: config.ApiUrl + '/auth/google/callback'
  },
  function (accessToken, refreshToken, profile, done) {
    var newUser = new User({
      email: profile._json.email,
      firstName: profile._json.given_name,
      lastName: profile._json.family_name,
      isNewUser: true,
      sharedUsers: []
    });

    User.getUserByEmail(profile._json.email, function (err, user) {
      if (err) throw err;

      if (!user) {

        Invites.getInviteeByEmail(profile._json.email, function (err, invitee) {
          if (err) throw err;

          if (invitee) {
            newUser.sharedUsers = invitee.shared;
          }

          User.createUser(newUser, function (err, user) {
            if (err) throw err;

            return done(null, user);
          });
        });
      } else {
        return done(null, user);
      }
    });
  }
);

var FStrategy = new FacebookStrategy({
    clientID: '1045632219162448',
    clientSecret: '1e60113c213dd6b8e92a425c73b34758',
    callbackURL: config.ApiUrl + '/auth/facebook/callback',
    profileFields: ['name', 'emails']
  },
  function (token, tokenSecret, profile, done) {
    var newUser = new User({
      email: profile._json.email,
      firstName: profile._json.first_name,
      lastName: profile._json.last_name,
      isNewUser: true,
      sharedUsers: []
    });

    User.getUserByEmail(profile._json.email, function (err, user) {
      if (err) throw err;

      if (!user) {

        Invites.getInviteeByEmail(profile._json.email, function (err, invitee) {
          if (err) throw err;

          if (invitee) {
            newUser.sharedUsers = invitee.shared;
          }

          User.createUser(newUser, function (err, user) {
            if (err) throw err;

            return done(null, user);
          });
        });
      } else {
        return done(null, user);
      }
    });
  }
);

module.exports = {
  LStrategy,
  GStrategy,
  FStrategy
}