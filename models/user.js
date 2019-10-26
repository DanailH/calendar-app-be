var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
  email: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  isNewUser: {
    type: Boolean
  }
});

var User = mongoose.model('User', UserSchema);

User.createUser = function (newUser, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

User.updateUser = function(updatedUser, callback) {
  updatedUser.save(callback)
}

User.getUserByEmail = function (email, callback) {
  var query = {
    email: email
  };

  User.findOne(query, callback);
}

User.getUserById = function (id, callback) {
  User.findById(id, callback);
}

User.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err;

    callback(null, isMatch);
  });
}

module.exports = User;
