var express = require('express');
var User = require('../models/user');
var router = express.Router();

router.get('/user', function(req, res) {
  var userId = req.query.userId;

  User.getUserById(userId, function (err, user) {
    if (err) throw err;
    
    res.send(user).end();
  });
});


module.exports = router;
