var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/user', function (req, res) {
  res.send(req.user);
});

module.exports = router;
