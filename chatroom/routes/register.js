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
    db.run("CREATE TABLE ChatHistory ( userName TEXT,  msgContent TEXT,  msgTime DATETIME DEFAULT CURRENT_TIMESTAMP, userColor TEXT)");
    db.run("CREATE TABLE UserInfo ( userId INTEGER PRIMARY KEY, userName TEXT, account TEXT, password TEXT, userColor TEXT)");
  }  
});

var stmtRegister = db.prepare("INSERT INTO UserInfo (userName, account, password, userColor) VALUES (?, ?, ?, ?)");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.post('/', function(req, res) {
  console.log("register received");
  stmtRegister.run(req.body.registerUserName, req.body.registerAccount, req.body.registerPassword, getRandomColor().replace('#',''));
  stmtRegister.finalize();
//   db.each("SELECT rowid AS id, userName, account, password FROM UserInfo", function(err, row) {
//   console.log(row.id + ": " + row.userName+ '   ' + row.account + '   ' + row.password);
// });
db.close();

res.redirect('/login');
});

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



module.exports = router;
