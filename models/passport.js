var User = require('./user')
var LocalStrategy = require('passport-local').Strategy;

var Strategy = new LocalStrategy (
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    console.log(email, password)

    User.getUserByEmail(email, function (err, user) {
      if (err) throw err;

      console.log(err, user)

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

module.exports = Strategy;
