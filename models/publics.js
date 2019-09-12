var mongoose = require('mongoose');

// Public Schema
var PublicSchema = mongoose.Schema({
  country: {
    type: String
  },
  countryCode: {
    type: String
  },
  publicHolidays: [String]
});

var Public = mongoose.model('Public', PublicSchema);

Public.getPublicByCountryCode = function (code, callback) {
  var query = {
    countryCode: code
  };

  Public.findOne(query, callback);
};

module.exports = Public;
