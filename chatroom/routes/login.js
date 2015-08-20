var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'login' });
  console.log("message");
});

router.post('/', function(req, res) {
    console.log("hahahahaha");
  });

module.exports = router;
