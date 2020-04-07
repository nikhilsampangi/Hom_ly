const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware_jwt");
const speakeasy = require("speakeasy");
const passport = require('passport');
const passportSetup= require("../../config/customerPassport");
const User = require("../../models/customer.model");
const Customer= require("../../joi_models/customer.model"); 

const MID= "VVdwCu48262795226018";
const MC= "MlZSaA0@T0WuIBW1";

const https= require('https');

 
/**
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/
const checksum_lib = require('../paytm_config/checksum');


const email = require("../send_email");

router.use(cors());

process.SECRET_KEY = "hackit";

function gen_OTP(secret_token) {
  var token = speakeasy.totp({
    secret: secret_token,
    encoding: "base32"
  });

  return token;
}

function verify_OTP(secret_token, OTP) {
  var tokenValidates = speakeasy.totp.verify({
    secret: secret_token,
    encoding: "base32",
    token: OTP,
    window: 3
  });

  return tokenValidates;
}

router.post("/register", register);

function register(req, res) {
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (user) {
        // In front-end check the status,
        // if status is '1' call send_otp api and load otp component,

        if (user.isVerified === false) {
          res
            .status(200)
            .send({ message: "Please verify your account!!!", status: "1" });
        } else {
          res.status(400).send({ message: "Account already exist" });
        }
      } else {
        bcrypt.hash(req.body.hashedPassword, 10, (err, hash) => {
          var secret = speakeasy.generateSecret({ length: 20 });

          const userData = {
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            email: req.body.email,
            internalAuth:{
              hashedPassword: hash,
              passwordResetToken: secret.base32,
              phoneNum: req.body.phonenumber,
            }
          };

          try {
            const value = Customer.validateAsync(userData);
            console.log(value);
          }
          catch (error) { 
            console.log(error);
          }

          User.create(userData)
            .then(customer => {
              var token = gen_OTP(customer.internalAuth.passwordResetToken);

              // email.send_verification_token(token, customer.email);

              res
                .status(200)
                .send({ message: "Please enter OTP!!!", status: "1" });
            })
            .catch(err => {
              var arr = Object.keys(err["errors"]);
              var errors = [];
              for (i in arr) {
                errors.push(err["errors"][arr[i]].message);
              }
              res.status(400).send({ message: errors[0] });
            });
        });
      }
    })
    .catch(err => {
      res
        .status(400)
        .send({ message: "Something went wrong, please try again!!!" });
    });
}

router.post("/verify_registration_otp", verifyRegistrationOtp);

function verifyRegistrationOtp(req, res) {
  User.findOne({
    email: req.body.email
  })
    .then(customer => {
      if (!customer) {
        res
          .status(400)
          .send({ message: "account does not exist, please register!!!" });
      } else {
        var tokenValidates = verify_OTP(
          customer.internalAuth[0].passwordResetToken,
          req.body.OTP
        );

        if (!tokenValidates) {
          res.status(400).send({ message: "INVALID OTP!!!" });
        } else {
            const newValues = { $set: { isVerified: true } };

            User.updateOne({ _id: customer._id }, newValues, function(
              err,
              success
            ) {
              if (err) {
                res.status(400).send({
                  message: "Something went wrong, please try again!!!"
                });
              } else {
                res.status(200).send("Successfully registered your account!!!");
              }
            });
        }
      }
    })
    .catch(err => {
      res
        .status(400)
        .send({ message: "Something went wrong, please try again!!!" });
    });
}


router.post("/verify_reset_password_otp", verifyPasswordOtp);

function verifyPasswordOtp(req, res) {
  User.findOne({
    email: req.body.email
  })
    .then(customer => {
      if (!customer) {
        res
          .status(400)
          .send({ message: "account does not exist, please register!!!" });
      } else {
        var tokenValidates = verify_OTP(
          customer.internalAuth[0].passwordResetToken,
          req.body.OTP
        );

        if (!tokenValidates) {
          res.status(400).send({ message: "INVALID OTP!!!" });
        } else {

            const newValues = { $set: {isValidated: true } };

            User.updateOne({ _id: customer._id }, newValues, function(
              err,
              success
            ) {
              if (err) {
                res.status(400).send({
                  message: "Something went wrong, please try again!!!"
                });
              } else {
                res.status(200).send("Validated!!!");
              }
            });
        }
      }
    })
    .catch(err => {
      res
        .status(400)
        .send({ message: "Something went wrong, please try again!!!" });
    });
}


router.post("/send_otp", resend);

function resend(req, res) {
  console.log("\n"+"send_otp called"+"\n");
  User.findOne({
    email: req.body.email
  })
  .then(customer=>{
    if(!customer){
      res.status(400).send({
        message: "account does not exist, please register!!!",
        status: "1"
      });
    }else {
      console.log("\n"+"send_otp for customer"+customer+"\n");
      var secret = speakeasy.generateSecret({ length: 20 });

      const newValues = { $set: { "internalAuth.$.passwordResetToken": secret.base32 } };
    
      User.updateOne({ 
        email: customer.email,
        "internalAuth._id":customer.internalAuth[0]._id  
      }, newValues, function(err, success) {
          if (err) {
            res
              .status(400)
              .send({ message: "Something went wrong, please try again!!!" });
          } else {
            var token = gen_OTP(secret.base32);

            email.send_verification_token(token, req.body.email);
      
            res.status(200).send("OTP sent!!!");
          }
      });
    }
  })

}

router.post("/reset_password", reset);

function reset(req, res) {
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (user.isValidated === true) {
        bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
          if (err) {
            res
              .status(400)
              .send({ message: "Something went wrong, please try again!!!" });
          } else {
            const newValues = {
              $set: { "internalAuth.$.hashedPassword": hash, isValidated: false }
            };

            User.updateOne({ 
              email: user.email, 
              "internalAuth._id":user.internalAuth[0]._id 
            }, newValues, function(
              err,
              success
            ) {
              if (err) {
                console.log("\n"+err+"\n");
                res.status(400).send({
                  message: "Something went wrong, please try again!!!"
                });
              } else {
                res.status(200).send("Password updated!!!");
              }
            });
          }
        });
      } else {
        // In frontend check status, call send_otp api and load otp component.
        res.status(400).send({
          message: "Please verify with otp to update passwords",
          status: "1"
        });
      }
    })
    .catch(err => {
      res.status(400).send({ message: "Something went wrong!!!" });
    });
}

router.get("/login", login);

function login(req, res) {
  req.body = req.query;
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (!user || user.isVerified === false) {
        res.status(400).send({ message: "Account does not exist" });
      } else {
        if (bcrypt.compareSync(req.body.hashedPassword, user.internalAuth[0].hashedPassword)) {
          // Passwords match
          const payload = {
            _id: user._id,
            email: user.email,
            firstname: user.firstname
          };
          let token = jwt.sign(payload, process.SECRET_KEY, {
            algorithm: "HS256",
            expiresIn: 86400
          });
          res.status(200).send(token);
        }else {
          // Passwords don't match
          res.status(400).send({ message: "Incorrect Password" });
        }
      }
    })
    .catch(err => {
      res
        .status(400)
        .send({ messsage: "Something went wrong, please try again!!!" });
    });
}


router.get("/profile", auth, profile);

function profile(req, res) {
  const user= req.user;
  User.findOne({
    email: user.email
  })
    .then(user => {
      if(!user){
        res.status(400).send({message: "User does not exist!!!!"});  
      }else {
        res.status(200).send({message: user});
      }
    })
    .catch(err => {
      res
        .status(400)
        .send({ messsage: "Something went wrong, please try again!!!" });
    });
}

router.get("/payment",  payment)

function payment(req, res){

      let params ={}
      params['MID'] = MID,
      params['WEBSITE'] = 'WEBSTAGING',
      params['CHANNEL_ID'] = 'WEB',
      params['INDUSTRY_TYPE_ID'] = 'Retail',
      params['ORDER_ID'] = 'ORD0009',
      params['CUST_ID'] = 'CUST0011',
      params['TXN_AMOUNT'] = '1',
      params['CALLBACK_URL'] = 'http://localhost:8008/customer/success',
      params['EMAIL'] = 'xyz@gmail.com',
      params['MOBILE_NO'] = '9876543211'

      checksum_lib.genchecksum(params, MC ,function(err,checksum){
          let txn_url = "https://securegw-stage.paytm.in/order/process"

          let form_fields = ""
          for(x in params)
          {
              form_fields += "<input type='hidden' name='"+x+"' value='"+params[x]+"'/>"

          }

          form_fields+="<input type='hidden' name='CHECKSUMHASH' value='"+checksum+"' />"

          var html = '<html><body><center><h1>Please wait! Do not refresh the page</h1></center><form method="post" action="'+txn_url+'" name="f1">'+form_fields +'</form><script type="text/javascript">document.f1.submit()</script></body></html>'
          res.writeHead(200,{'Content-Type' : 'text/html'})
          res.write(html)
          res.end()
      })
            
}

router.post('/success', success)

function success(req, res){

  console.log(req.body);
  res.send(req.body);
}

router.get('/status', status)

function status(req, res){

/* initialize an object */
var paytmParams = {};

/* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
paytmParams["MID"] = MID;

/* Enter your order id which needs to be check status for */
paytmParams["ORDERID"] = "ORD0009";

/**
* Generate checksum by parameters we have
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
checksum_lib.genchecksum(paytmParams, MC, function(err, checksum){
    /* put generated checksum value here */
    paytmParams["CHECKSUMHASH"] = "vP4RTEi6WQ+Y0zgZNWh77OCfdmCrMienOU9fGoLdBEA+orUlD3+9au26/7SGYP6bIA3zE7VNqtzoKvjV4hfUd4iaVPIKIXde7TDk//snLJ0=";

    /* prepare JSON string for request */
    var post_data = JSON.stringify(paytmParams);

    var options = {

        /* for Staging */
        hostname: 'securegw-stage.paytm.in',

        /* for Production */
        // hostname: 'securegw.paytm.in',

        port: 443,
        path: '/order/status',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
        }
    };

    // Set up the request
    var response = "";
    var post_req = https.request(options, function(post_res) {
        post_res.on('data', function (chunk) {
            response += chunk;
        });

        post_res.on('end', function(){
            console.log('Response: ', response);
        });
    });
});
}


/* Google Authentication API. */

router.get(
  "/auth/google",
  passport.authenticate("google", { 
      scope: ["profile", "email"] 
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/customer/auth/google", session: false }), (req, res) => {
      const token= req.user;
      console.log("\n"+token+"\n");
      res.redirect("http://localhost:3000/"+`${token}`);
  }
);

module.exports = router;
