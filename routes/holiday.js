var express = require('express');
var router = express.Router();
var Holidays = require('../models/holidays');
var Publics = require('../models/publics');
var User = require('../models/user');

router.get('/public', function (req, res) {
  var countryCode = req.query.countryCode;

  Publics.getPublicByCountryCode(countryCode, function (err, publicHolidays) {
    if (err) throw err;

    if (publicHolidays) {
      res.send(publicHolidays).end();
    } else {
      res.status(404).send("{errors: \"No data for the given country\"}").end();
    }
  });
});

router.get('/holidays', function (req, res) {
  var userId = req.query.userId;

  Holidays.getHolidaysByUserId(userId, function (err, holidays) {
    if (err) throw err;

    if (!holidays) {
      res.send({
        userId: userId,
        country: '',
        holidaysCount: 0,
        selectedHolidays: []
      }).end();
    } else {
      res.send(holidays).end();
    }
  });
});

router.post('/holidays', function (req, res) {
  var userId = req.body.userId;
  var country = req.body.country;
  var holidaysCount = req.body.holidaysCount;
  var selectedHolidays = req.body.selectedHolidays;

  var newDataSet = new Holidays({
    userId: userId,
    country: '',
    holidaysCount: holidaysCount,
    selectedHolidays: selectedHolidays
  });

  User.getUserById(userId, function (err, user) {
    if (err) throw err;

    user.isNewUser = false;
    User.updateUser(user)
  });

  Holidays.getHolidaysByUserId(userId, function (err, holidays) {
    if (err) throw err;

    if (!holidays) {
      newDataSet.save(function (err, data) {
        if (err) throw err;

        res.send(data).end();
      });
    } else {
      holidays.userId = userId;
      holidays.country = country;
      holidays.holidaysCount = holidaysCount;
      holidays.selectedHolidays = selectedHolidays;

      holidays.save(function (err, data) {
        if (err) throw err;

        res.send(data).end();
      });
    }
  });
});

module.exports = router;
