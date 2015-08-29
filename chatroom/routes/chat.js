var express = require('express');
var router = express.Router();


function restrict(req, res, next) {
  if (req.session.userName) {
    next();
  } else {
    req.session.error = 'Access denied!';
    console.log('no res');
    res.redirect('/login');
  }
}
/* GET home page. */
router.get('/', restrict, function(req, res, next) {
  console.log(req.cookies);
  console.log("session ------------------ " + req.session.userName);

  res.render('chat', { title: 'Chatroom', username: req.session.userName });

});

module.exports = router;
