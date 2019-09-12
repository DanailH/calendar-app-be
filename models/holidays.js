var mongoose = require('mongoose');

// Holidays Schema
var HolidaysSchema = mongoose.Schema({
  userId: {
    type: String
  },
  country: {
    type: String
  },
  holidaysCount: {
    type: Number
  },
  selectedHolidays: [String]
});

var Holidays = mongoose.model('Holidays', HolidaysSchema);

Holidays.getHolidaysByUserId = function (userId, callback) {
  var query = {
    userId: userId
  };

  Holidays.findOne(query, callback);
};

module.exports = Holidays;
