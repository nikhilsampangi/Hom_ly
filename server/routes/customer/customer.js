const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware_jwt");
const speakeasy = require("speakeasy");
const passport = require('passport');
const passportSetup= require("../../config/gOAuth/customerPassport");
const User = require("../../models/customer.model");
const Customer= require("../../joi_models/authValidation.model"); 
const transactions= require('../transactions');
const passwordCheck= require('../../joi_models/passwordCheck.model'); 
const Order= require('../../models/transactions.model');
const email = require("../send_email");
const elastic = require("../elasticSearch")

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
  User.findOne({
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

            internalAuth:{
              hashedPassword: req.body.hashedPassword,
              passwordResetToken: secret.base32,
              phoneNum: req.body.phonenumber,
            }
          };

        const {error, value} = Customer.validate(userData);

        if(error) {
        
          res.status(400).send({message: error.message});
        
        }else {

          bcrypt.hash(req.body.hashedPassword, 10, (err, hash) => {
            
            userData.internalAuth.hashedPassword= hash;

            User.create(userData)
            .then(customer => {
              var token = gen_OTP(customer.internalAuth.passwordResetToken);

              email.send_verification_token(token, customer.email);

              res.status(200).send({ message: "Please enter OTP!!!", status: "1" });
            })
            .catch(err => {
              res.status(400).send({ message: "Something went wrong, please try again!!!" });
            }); 
        
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

      var secret = speakeasy.generateSecret({ length: 20 });

      const newValues = { $set: { "internalAuth.passwordResetToken": secret.base32 } };
    
      User.updateOne({ 
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
  User.findOne({
    email: req.body.email,
  })
    .then((customer) => {
      if (!customer) {
        res
          .status(400)
          .send({ message: "account does not exist, please register!!!" });
      } else {
        var tokenValidates = verify_OTP(
          customer.internalAuth.passwordResetToken,
          req.body.OTP
        );

        if (!tokenValidates) {
          res.status(400).send({ message: "INVALID OTP!!!" });
        } else {
            const newValues = { $set: { isVerified: true } };

            User.updateOne({ _id: customer._id }, newValues, function (
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
          customer.internalAuth.passwordResetToken,
          req.body.OTP
        );

        if (!tokenValidates) {
          res.status(400).send({ message: "INVALID OTP!!!" });
        } else {

            const newValues = { $set: {isValidated: true, isVerified: true} };

            User.updateOne({ _id: customer._id }, newValues, function (
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
  User.findOne({
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
                $set: { "internalAuth.hashedPassword": hash, isValidated: false }
              };
  
              User.updateOne({ 
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
  User.findOne({
    email: req.body.email,
  })
    .then(user => {
      if (!user || user.isVerified === false) {
        res.status(400).send({ message: "Invalid credentials" });
      } else {
        if (bcrypt.compareSync(req.body.hashedPassword, user.internalAuth.hashedPassword)) {
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

router.get("/order", payment)

function payment(req, res){
  const userId= "5e8e350607ccf30b789be8b1";
  User.findOne({
    _id: userId
  }).then(user=>{
    if(!user) {
      res.status(400).send({message: "No User Exist!!!"});
    }else {
      var date = new Date();
      date = date.toISOString();
      
      const orderData= {
          custId: user._id,
          chefId: "5e8e350607",
          createdAt: date,
          status: "initiated",
          items: [
            {
              itemName: "CHICKEN MAGGI",
              itemCost: 10
            },

            {
              itemName: "CHICKEN DOSA",
              itemCost: 20
            },

            {
              itemName: "CHICKEN NOODLES",
              itemCost: 30
            },

            {
              itemName: "CHICKEN RICE",
              itemCost: 40
            },

          ]
      };
      Order.create(orderData)
        .then(order=>{
            console.log("\nItems added!!!\n");
            Order.aggregate(
              [
                { $match : { _id: order._id } },
                { $unwind : '$items' }, 
                { $group : 
                  {
                    _id: null,
                    totalCost: {$sum: '$items.itemCost'}
                  }
                }
              ]).then(costData=>{
                console.log("\ncost calculated!!!\n "+costData[0].totalCost);

                const paymentData= {
                  orderId: new String(order._id),
                  customerId: new String(user._id),
                  amount: new String(costData[0].totalCost),
                  email: user.email,
                  phoneNumber: new String(user.internalAuth.phoneNum)
                };

                console.log(paymentData);
            
                transactions.payment(paymentData, (err, params)=>{
                  if(err){
                    res.status(200).send({message: "error!!!"});
                  }else {
                    let txn_url = "https://securegw-stage.paytm.in/order/process"

                    let form_fields = "";
                    for(x in params)
                    {
                        form_fields += "<input type='hidden' name='"+x+"' value='"+params[x]+"'/>"

                    }
                    var html = '<html><body><center><h2>Please wait! Do not refresh the page</h2></center><form method="post" action="'+txn_url+'" name="f1">'+form_fields +'</form><script type="text/javascript">document.f1.submit()</script></body></html>'
                    res.writeHead(200,{'Content-Type' : 'text/html'});
                    res.write(html);
                    res.end();
                  }

                });
                
              }).catch(err=>{
                console.log(err);
                res.status(400).send({message: err});
              })
        }).catch(err=>{
          console.log(err);
          res.status(400).send({message: err});
        })
    }
  }).catch(err=>{
    res.status(400).send({message: "something went wrong!!!"});
  })        
}

router.post('/success', success)

function success(req, res){

  transactions.success(req.body, (err, resData)=>{
    if(err) {
      res.status(400).send({message: err});
    }else {
      const response= JSON.parse(resData);
      console.log("\n"+response+"\n");
      var date = new Date();
      date = date.toISOString();
      const newValues= {
        transactionId: response.TXNID,
        amount: response.TXNAMOUNT,
        updatedAt: date,
        referenceId: response.BANKTXNID,
        modeOfPayment: response.PAYMENTMODE,
        bankName: response.BANKNAME
      };

      if(response.STATUS === "TXN_FAILURE"){
        newValues['status']= 'failed';
        Order.updateOne({_id: response.ORDERID}, newValues, (err, Success)=>{
          if(err){
            res.status(400).send({message: "something went wrong!!!"});
          }else {
            res.status(400).send({message: response.RESPMSG});
          }
        });
      }else {
        newValues['status']= 'completed';
        Order.updateOne({_id: response.ORDERID}, newValues, (err, Success)=>{
          if(err){
            res.status(200).send({message: "something went wrong!!!"});
          }else {
            res.status(200).send({message: response.RESPMSG});
          }
        });
      }
    }
  })

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

router.get("/profile", auth, get_profile);

function get_profile(req, res) {
  User.findOne({
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
  User.findOne({
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
      User.updateOne({ email: req.body.email }, userData, function (
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

router.post("/elasticsearch", create);

function create(req, res){
  const indexName = 'restuarents';
  const Id= '7';
  const value= "hotel";
  const resName = "Unknown Hotel";
  const resPlace = "Ouskirts of MBNR";
  const resRating = "3.0";
  const resLat= 16.754188;
  const resLon= 78.033957;

  const lat= 16.750880;
  const lng= 78.036206;

  const payload = {
    deliveryAgentId: '7',
    deliveryAgentName: 'yenugonda',
    // place: resPlace,
    // rating: resRating,
    // suggest: {
    //   input: resName.split(" "),
    //   contexts: {
    //     location: {
    //       lat: resLat,
    //       lon: resLon
    //     }
    //   }
    // },
    pin : {
      location : {
          lat : resLat,
          lon : resLon
      }
    }
  };

  elastic.getNearestDeliveryAgents('deliveryagents', lat, lng, (err,response)=>{
    if(err){
      res.status(400).send({message: err});
    }else {
      res.status(200).send({message: response.body});
    }
  });
}

module.exports = router;
