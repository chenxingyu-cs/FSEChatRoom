var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'register' });
  console.log("register");
});

router.post('/', function(req, res) {
  console.log("register received");
  console.log(req.body);
  
});

module.exports = router;
