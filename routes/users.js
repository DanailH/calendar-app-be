var express = require('express');
var router = express.Router();

// Endpoint to get current user
router.get('/user', function(req, res) {
  res.send(req.user);
});

module.exports = router;
