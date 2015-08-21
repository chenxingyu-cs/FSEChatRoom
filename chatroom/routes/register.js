var express = require('express');
var router = express.Router();

//create the database file
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

var stmtRegister = db.prepare("INSERT INTO UserInfo (userName, account, password) VALUES (?, ?, ?)");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'register' });
  console.log("register");
});

router.post('/', function(req, res) {
  console.log("register received");
  stmtRegister.run(req.body.username, req.body.account, req.body.password);
  stmtRegister.finalize();
db.each("SELECT rowid AS id, userName, account, password FROM UserInfo", function(err, row) {
  console.log(row.id + ": " + row.userName+ '   ' + row.account + '   ' + row.password);
});
db.close();
});



module.exports = router;
