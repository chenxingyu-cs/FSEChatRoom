var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
  console.log("message");
});

router.post('/', function(req, res) {
  console.log("login received");
  var fs = require("fs");
  var file = "chat.db";
  var exists = fs.existsSync(file);
  if(!exists) {
    console.log("Creating DB file.");
    fs.openSync(file, "w");
  }

  //Create the chat-history Table
  var sqlite3 = require("sqlite3").verbose();
  var db = new sqlite3.Database(file);

  db.serialize(function() {
    if(!exists) {
      db.run("CREATE TABLE ChatHistory ( userName TEXT,  msgContent TEXT,  msgTime DATETIME DEFAULT CURRENT_TIMESTAMP, userColor TEXT)");
      db.run("CREATE TABLE UserInfo ( userId INTEGER PRIMARY KEY, userName TEXT, account TEXT, password TEXT, userColor TEXT)");
    }  
  });
  db.each("SELECT count(*) as num, userId, userName, password, userColor FROM UserInfo where account ='" +req.body.signinAccount + "'" , function(err, row) {
    if(row.num != 0){
      if(row.password == req.body.signinPassword){
        req.session.regenerate(function(){

        req.session.userName = row.userName;
        req.session.userId = row.userId;
        req.session.userColor = row.userColor;
        req.session.success = 'Authenticated as ' 
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect('/chat');

      });

      }else{
        console.log("psw wrong");
        res.render('login', { title: 'Login', err: 'You got a wrong Login password' });
      }
    }else{
      console.log("no account exits");
      res.render('login', { title: 'Login', err: 'No such account exists' });
    }
  })

  db.close();

  
});

module.exports = router;
