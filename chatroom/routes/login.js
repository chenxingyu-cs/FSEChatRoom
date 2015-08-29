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
      db.run("CREATE TABLE ChatHistory ( userName TEXT,  msgContent TEXT,  msgTime DATETIME DEFAULT CURRENT_TIMESTAMP, userColor TEXT)");
      db.run("CREATE TABLE UserInfo ( userId INTEGER PRIMARY KEY, userName TEXT, account TEXT, password TEXT, userColor TEXT)");
    }  
  });
  db.each("SELECT count(*) as num, userId, userName, password FROM UserInfo where account ='" +req.body.signinAccount + "'" , function(err, row) {
    if(row.num != 0){
      if(row.password == req.body.signinPassword){
        // console.log(row.userId + ': ' + row.userName + " which psw is: " + row.password);
        // res.clearCookie('username');
        // res.cookie('username',row.userName,  { expires: new Date(Date.now() + 900000), httpOnly: true });

        // req.session.userName = row.userName;
        // res.redirect('/chat');
        req.session.regenerate(function(){
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.userName = row.userName;
        req.session.success = 'Authenticated as ' 
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect('/chat');
      });

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
