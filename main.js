//var http = require("http");
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mca6',
  database: 'arman'
});
connection.connect(function (err) {
  if (err) throw err
  console.log('You are now connected with mysql database...')
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })
);
app.listen(3000);

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'armantache@gmail.com',
    pass: 'tache1212'
  }
});

const userdata = {
  name: 'arman chaudhary'
}

jwt.sign({ userdata }, 'privatetoken', { expiresIn: '300s' }, (err, token) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log(token);
    var mailOptions = {
      from: 'armantache@gmail.com',
      to: 'arman.ali@arstudioz.com',
      subject: 'Sending Email using Node.js',
      // text: 'http://localhost:3000/'+token
      html: '<!DOCTYPE html><html><head><title>Forget Password Email</title></head><body><div><h3>Dear User</h3><p>You requested for a password reset, kindly use this token <a href="http://localhost:3000/resetpassword/token/' + token + '">CLICK HERE</a> to reset your password</p><br><p>Cheers!</p></div></body></html>',
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
     
      }
    });
  }
});

app.get('/resetpassword/token', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(token);
  // console.log(req.headers);
  //console.log(JSON.stringify(req.headers));
 
  res.send('<form action="/resetpassword" method="POST">' +
    '<input type="hidden" name="token" value="' + req.params.token + '" />' +
    '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
    '<input type="submit" value="Reset Password" />' +
    '</form>');

});

app.get('/resetpassword', function (req, res) {
  var token = req.query.token;
  jwt.verify(token, 'privatetoken', function (err, decoded) {
    if (err) {
      res.send(err);
    } else {
      var user = { "email": "armantache@gmail.com" };
      res.json(user);
    }
  })
})




    // var server = app.listen(3000, "127.0.0.1", function () {

      //   var host = server.address().address
      //   var port = server.address().port
      //   console.log("Example app listening at http://%s:%s", host, port)
      // });


// app.put('/customer', function (req, res) {
//     connection.query('UPDATE user SET email=? where id=?', [req.body.email,req.body.id], function (error, results, fields) {
//        if (error) throw error;
//        res.end(JSON.stringify(results));
//      });
//  });

// app.get('/customer', function (req, res) {
//     connection.query('select * from user', function (error, results, fields) {
//        if (error) throw error;
//        res.end(JSON.stringify(results));
//      });
//  });
