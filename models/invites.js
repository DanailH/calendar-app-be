var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var InvitesSchema = mongoose.Schema({
  email: {
    type: String
  },
  shared: [String]
});

var Invites = mongoose.model('Invites', InvitesSchema);

Invites.setInvitee = function (invitee, callback) {
  invitee.save(callback)
}

Invites.getInviteeByEmail = function (email, callback) {
  var query = {
    email: email
  };

  Invites.findOne(query, callback);
}

module.exports = Invites;