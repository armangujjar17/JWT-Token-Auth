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

// app.get('/', function(req,res)
// {
//   res.send('<form action="/passwordreset" method="POST">' +
//   '<input type="email" name="email" value="" placeholder="Enter your email address..." />' +
//   '<input type="submit" value="Reset Password" />' +
// '</form>');
// });

//app.post('/',function(req,res){
  //var email=req.body.email;
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'armantache@gmail.com',
    pass: '******'
  }
});

const userdata = {
  email: 'ayan@mail.com'
}

jwt.sign({ userdata }, 'privatetoken', { expiresIn: '600s' }, (err, token) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log(token);
    var mailOptions = {
      from: 'armantache@gmail.com',
      to: 'arman.ali@arstudioz.com',
      subject: 'Sending Email Token using Node.js',
      // text: 'http://localhost:3000/'+token
      // html: '<!DOCTYPE html><html><head><title>Forget Password Email</title></head><body><div><h3>Dear User</h3><p>You requested for a password reset, kindly use this token <a href="http://localhost:3000/resetpassword'+token+'">'+token+'</a> to reset your password</p><br><p>Cheers!</p></div></body></html>',
      text:'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +  
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +  
      'http://localhost:3000' + '/resetpassword/' + token + '\n\n' +  
      'If you did not request this, please ignore this email and your password will remain unchanged.\n'  
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        // response.send('Token sent on your mail please check there!');
		    // response.end();
      }
    });
  }
});
  
//});


app.get('/resetpassword/:token', function (req, res) {
 //console.log(res);
  //console.log([req.params.token]);
  
 var token = req.params.token;
  jwt.verify(token, 'privatetoken', function (err,varifiedJwt) {
    if (err) {
      res.send(err);
    } else {
      console.log(varifiedJwt);
      connection.query('UPDATE user SET password="raka45678" where email=?',[varifiedJwt.userdata.email] , function(error, results, fields)
      {
        
        console.log("[mysql error]",error);
        res.end('Record has been updated!');
      });
    }
  });

  //res.send("hello");
  // res.send('<form action="/resetpassword" method="POST">' +
  //   '<input type="hidden" name="token" value="' + req.params.token + '" />' +
  //   '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
  //   '<input type="submit" value="Reset Password" />' +
  //   '</form>');
});

    // var server = app.listen(3000, "127.0.0.1", function () {

      //   var host = server.address().address
      //   var port = server.address().port
      //   console.log("Example app listening at http://%s:%s", host, port)
      // });

      // app.get('/reseted', function (req, res) {
//   var token = req.query.token;
//   jwt.verify(token, 'privatetoken', function (err,vrifiedJwt) {
//     if (err) {
//       res.send(err);
//     } else {
//       console.log(vrifiedJwt)
//     }
//   });
// })

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
