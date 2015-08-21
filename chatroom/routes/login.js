var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'login' });
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
      db.run("CREATE TABLE ChatHistory ( userName TEXT,  msgContent TEXT,  msgTime DATETIME DEFAULT CURRENT_TIMESTAMP)");
      db.run("CREATE TABLE UserInfo ( userId INTEGER PRIMARY KEY, userName TEXT, account TEXT, password TEXT, lastLoginTime DATETIME DEFAULT CURRENT_TIMESTAMP)");
    }  
  });
  db.each("SELECT count(*) as num, userId, userName, password FROM UserInfo where account ='" +req.body.account + "'" , function(err, row) {
    if(row.num != 0){
      if(row.password == req.body.password){
        console.log(row.userId + ': ' + row.userName + " which psw is: " + row.password);
        res.render('chat', { title: 'success', username: row.userName });
      }else{
        console.log("psw wrong");
      }
    }else{
      console.log("no account exits");
    }
  })

  db.close();

  
});

module.exports = router;
