const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware_jwt");
const randomToken = require("random-token");
const speakeasy = require('speakeasy');
const Agent = require("../../models/deliveryAgent.model");
const email = require("../send_email");
const mongoose = require("mongoose");

const passwordCheck= require('../../joi_models/passwordCheck.model'); 
const Customer= require("../../joi_models/customer.model");


router.use(cors());

process.SECRET_KEY = "hackit";

function gen_OTP(secret_token) {
  var token = speakeasy.totp({
    secret: secret_token,
    encoding: "base32",
  });

  return token;
}

function verify_OTP(secret_token, OTP) {
  var tokenValidates = speakeasy.totp.verify({
    secret: secret_token,
    encoding: "base32",
    token: OTP,
    window: 3,
  });

  return tokenValidates;
}

router.post("/register", register);

function register(req, res) {
  Agent.findOne({
    email: req.body.email,
  })
    .then((user) => {
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
        var secret = speakeasy.generateSecret({ length: 20 });
        
        const userData = {
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            email: req.body.email,

            
            hashedPassword: req.body.hashedPassword,
            passwordResetToken: secret.base32,
            phoneNum: req.body.phonenumber,
            
          };
        
        //const {error, value} = Customer.validate(userData);
        

        // if(error) {
        //   console.log("--------");
        //   res.status(400).send({message: error.message});
        
        // }else {

          bcrypt.hash(req.body.hashedPassword, 10, (err, hash) => {
            console.log("got it");
            userData.hashedPassword= hash;

            Agent.create(userData)
            .then(customer => {
              var token = gen_OTP(customer.passwordResetToken);
              console.log("-------------");
              email.send_verification_token(token, customer.email);

              res.status(200).send({ message: "Please enter OTP!!!", status: "1" });
            })
            .catch(err => {
              res.status(400).send({ message: err }); //"Something went wrong, please try again!!!"
            }); 
        
          });
          
        //}
      }

    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: "Something went wrong, please try again!!!" });
    });

}


router.post("/send_otp", resend);

function resend(req, res) {
  console.log("\n"+"send_otp called"+"\n");
  Agent.findOne({
    email: req.body.email
  })
  .then(customer=>{
    if(!customer){
      res.status(400).send({
        message: "account does not exist, please register!!!",
        status: "1"
      });
    }else {

      var secret = speakeasy.generateSecret({ length: 20 });

      const newValues = { $set: { "passwordResetToken": secret.base32 } };
    
      Agent.updateOne({ 
        email: customer.email,
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


router.post("/verify_registration_otp", verifyRegistrationOtp);

function verifyRegistrationOtp(req, res) {
  Agent.findOne({
    email: req.body.email,
  })
    .then((customer) => {
      if (!customer) {
        res
          .status(400)
          .send({ message: "account does not exist, please register!!!" });
      } else {
        var tokenValidates = verify_OTP(
          customer.passwordResetToken,
          req.body.OTP
        );

        if (!tokenValidates) {
          res.status(400).send({ message: "INVALID OTP!!!" });
        } else {
            const newValues = { $set: { isVerified: true } };

            Agent.updateOne({ _id: customer._id }, newValues, function (
              err,
              success
            ) {
              if (err) {
                res.status(400).send({
                  message: "Something went wrong, please try again!!!",
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
  Agent.findOne({
    email: req.body.email
  })
    .then(customer => {
      if (!customer) {
        res
          .status(400)
          .send({ message: "account does not exist, please register!!!" });
      } else {
        var tokenValidates = verify_OTP(
          customer.passwordResetToken,
          req.body.OTP
        );

        if (!tokenValidates) {
          res.status(400).send({ message: "INVALID OTP!!!" });
        } else {

            const newValues = { $set: {isValidated: true, isVerified: true} };

            Agent.updateOne({ _id: customer._id }, newValues, function (
              err,
              success
            ) {
              if (err) {
                res.status(400).send({
                  message: "Something went wrong, please try again!!!",
                });
              } else {
                res.status(200).send("Validated!!!");
              }
            });
        }
      }
    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: "Something went wrong, please try again!!!" });
    });
}

router.post("/reset_password", reset);

function reset(req, res) {
  Agent.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (user.isValidated === true) {
        const {error, value}= passwordCheck.validate({password: req.body.newPassword})

        if(error) {
          
          res.status(400).send({message:error.message});

        }else {
          
          bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
            if (err) {
              res
                .status(400)
                .send({ message: "Something went wrong, please try again!!!" });
            } else {
              const newValues = {
                $set: { "hashedPassword": hash, isValidated: false }
              };
  
              Agent.updateOne({ 
                email: user.email, 
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
        }
      } else {
        // In frontend check status, call send_otp api and load otp component.
        res.status(400).send({
          message: "Please verify with otp to update passwords",
          status: "1",
        });
      }
    })
    .catch((err) => {
      res.status(400).send({ message: "Something went wrong!!!" });
    });
}

router.get("/login", login);

function login(req, res) {
  req.body = req.query;
  Agent.findOne({
    email: req.body.email,
  })
    .then(user => {
      if (!user || user.isVerified === false) {
        res.status(400).send({ message: "Invalid credentials" });
      } else {
        if (bcrypt.compareSync(req.body.hashedPassword, user.hashedPassword)) {
          // Passwords match
          const payload = {
            _id: user._id,
            email: user.email,
            firstname: user.firstname,
          };
          let token = jwt.sign(payload, process.SECRET_KEY, {
            algorithm: "HS256",
            expiresIn: 86400,
          });
          res.status(200).send(token);
        }else {
          // Passwords don't match
          res.status(400).send({ message: "Incorrect Password" });
        }
      }
    })
    .catch((err) => {
      res
        .status(400)
        .send({ messsage: "Something went wrong, please try again!!!" });
    });
}

router.get("/profile", auth, get_profile);

function get_profile(req, res) {
  Agent.findOne({
    _id: req.user._id,
  })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.json({ error: "user does not exist" });
      }
    })
    .catch((err) => {
      res.json("error:" + err);
    });
}

router.post("/edit_profile", edit_profile);

function edit_profile(req, res) {
  Agent.findOne({
    email: req.body.email,
  })
    .then((user) => {
      const userData = {
        $set: {
          firstName: req.body.firstname,
          lastName: req.body.lastname,
          phoneNum: req.body.phonenumber,
          isVeg: req.body.veg,
          Address: {
            Localty: req.body.localty,
            City: req.body.city,
            State: req.body.state,
            Pincode: req.body.pincode,
          },
        },
      };
      Agent.updateOne({ email: req.body.email }, userData, function (
        err,
        success
      ) {
        if (err) {
          res.status(400).send({
            message: "Something went wrong, please try again!!!",
          });
        } else {
          res.status(200).send("Details Updated");
        }
      });
    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: "Something went wrong, please try again!!!" });
    });
}

module.exports = router;
