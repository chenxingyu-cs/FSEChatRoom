var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.cookies);
  res.render('chat', { title: 'Chatroom', username: req.cookies.username});

});

module.exports = router;
