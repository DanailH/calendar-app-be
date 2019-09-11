var express = require('express');
var router = express.Router();
var Holidays = require('../models/holidays');

// Endpoint to get current user
router.get('/holidays', function (req, res) {
  var userId = req.query.userId;

  Holidays.getHolidaysByUserId(userId, function (err, holidays) {
    if (err) throw err;

    if (!holidays) {
      res.send({
        userId: userId,
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
  var holidaysCount = req.body.holidaysCount;
  var selectedHolidays = req.body.selectedHolidays;

  var newDataSet = new Holidays({
    userId: userId,
    holidaysCount: holidaysCount,
    selectedHolidays: selectedHolidays
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
