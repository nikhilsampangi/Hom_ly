const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware_jwt");
const randomToken = require("random-token");
const speakeasy = require('speakeasy');
const Agent = require("../../models/deliveryAgent.model");
const Order= require('../../models/transactions.model');
const email = require("../send_email");
const mongoose = require("mongoose");

const passwordCheck= require('../../joi_models/passwordCheck.model'); 
const deliveryAgent= require("../../joi_models/deliveryAgent.model");

const elastic = require("../elasticSearch")


var path = require('path');


router.use(cors());

process.SECRET_KEY = "hackit";

const multer  = require('multer');

const store = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toDateString() + '-' + file.originalname)
  }
})

const fileFilter= (req, file, cb) => {
 
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
  }
  else{
    cb(new Error('invalid filetype!!!'), false)
  }
}

const upload = multer({ 
  storage: store,
  limits: {fileSize: 1024 * 1024 * 5},
  fileFilter: fileFilter
});


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

// router.post("/register", upload, register);

router.post("/elasticSearch", createIndex)

function createIndex(req, res) {
  
  indexName = "deliveryagents"
  
  // elastic.checkStatus((err, resp) => {
  //   if(err) {
  //     res.status(400).send({message: err.name})
  //   }else {
  //     elastic.createDeliveryAgentIndex(indexName, (error, response) => {
  //       if(error) {
  //         res.status(400).send({message : error.name})
  //       }else {
  //         res.status(200).send({message : "created Index for Delivery Agents"}) 
  //       }
  //     })
  //   }
  // })


  elastic.findDocs(indexName, '5f18a3886df2161b60fd04f7', (err, resp) => {
    if(err) {
      res.status(400).send({message: err.name})
    }else {
        res.status(200).send({message : resp.body._source}) 
      }
  })
}


router.post("/register", upload.single('licenseImage'), register);

function register(req, res) {
  Agent.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (user) {
        // In front-end check the status,
        // if status is '1' call send_otp api and load otp component,

        if (user.isRegistered === false) {
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
        
        const {error, value} = deliveryAgent.validate(userData);
        

        if(error) {
          //console.log("--------");
          res.status(400).send({message: error.message});
        
        }else {

          bcrypt.hash(req.body.hashedPassword, 10, (err, hash) => {

            var imagePath= req.file.path.replace(/\\/g, "/");

            userData.drivingLicense= imagePath;
            userData.hashedPassword= hash;

            Agent.create(userData)
            .then(customer => {
              var token = gen_OTP(customer.passwordResetToken);
              email.send_verification_token(token, customer.email);

              res.status(200).send({ message: "Please enter OTP!!!", status: "1" });
            })
            .catch(err => {
              res.status(400).send({ message: err }); //"Something went wrong, please try again!!!"
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
      
            res.status(200).send({message : "OTP sent!!!"});
          }
      });
    }
  })

}


router.post("/verify_registration_otp", verifyRegistrationOtp);

function verifyRegistrationOtp(req, res) {
  Agent.findOne({
    email: req.body.email,
  }).then((customer) => {
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
        
        }else {
            
          const newValues = { $set: { isRegistered: true } };

          Agent.updateOne({ _id: customer._id }, newValues, function (err,success) {

            if (err) {
              res.status(400).send({
                message: "Something went wrong, please try again!!!",
              });
            }else {

              const payload = {
                deiveryAgentId: customer._id,
                deliveryAgentName : customer.firstName+' '+customer.lastName,
                pin : {
                  location : {
                      lat : req.body.lat,
                      lon : req.body.lng
                  }
                }
              };

              elastic.indexing('deliveryagents', customer._id, payload, (error, response) => {
                if(error) {
                  res.status(400).send({message: error})
                }else {
                  res.status(200).send({message: "Successfully registered your account!!!"});
                }
              });

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

            const newValues = { $set: {isValidated: true, isRegistered: true} };

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
      if (!user || user.isRegistered === false) {
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

router.post("/updateDeliveryAgentLocation", auth, updateLocation); //patch

function updateLocation(req, res) {
  
  Agent.findOne({
    _id: req.user._id,
  })
    .then((user) => {
      if(user) {
        
        elastic.updateDeliverAgentLocation('deliveryagents', req.user._id, req.body.lat, req.body.lng, (err, resp) => {
          if(err) {
            res.status(400).send({message: "location not updated"})
          }else {
            res.status(200).send({message: resp.body.result})
          }
        });

      }else {
        res.status(400).send({ message: "user does not exist" });
      }
    })
    .catch((err) => {
      res.status(400).send({message: err});
    });  
}

// router.post("/updateDeliveryAgentLocation"updateLocation);
router.get("/users", async (req, res) => {
  
  Agent.find({}, (err, profile)=> {
    res.send({res: profile});
  });
  // let doc = await Agent.updateOne(
  //   { _id: mongoose.Types.ObjectId("5f1335aefffad6246885f2db") },
  //   { $set: { phoneNum: 9121587453 } }
  // );
  // res.send({res: doc});
})

router.get("/findAgent", findAgent);

async function assignAgent(agents, no_of_agents){
  var randomSelect = Math.floor(Math.random() * no_of_agents);
  if(agents[randomSelect].maxOrders <3){
    return agents[randomSelect].id;
  }else{
    assignAgent(agents, no_of_agents);
  }
}

async function findAgent(req, res) {
  agents = [{
    "maxOrders": 0,
    "firstName": "shiva",
    "email": "bharathjohn57@gmail.com",
    "phoneNum": 9121587454,
    "id": "1001"
  },
  {
    "maxOrders": 2,
    "firstName": "sai",
    "email": "bharathjohn58@gmail.com",
    "phoneNum": 7337306815,
    "id": "1002"
  }, 
  {
    "maxOrders": 3,
    "firstName": "charan",
    "email": "bharathjohn59@gmail.com",
    "phoneNum": 9100642961,
    "id": "1003"
  }];
  var no_of_agents = agents.length;

  var assignedAgentId = await assignAgent(agents, no_of_agents);

  let orderUpdate = await Order.updateOne(
    { transactionId: "5f1343042c64f72c84cbe004" },
    { $set: { deliveryAgent: String(assignedAgentId), deliveryStatus: 1 } }
  );
  
  let agentUpdate = await Agent.updateOne(
    { _id: mongoose.Types.ObjectId("5f1343042c64f72c84cbe004") },
    { $inc: { maxOrders: 1 } }
  );
  res.send({agents: assignedAgentId});
}
// when order is delevered then reduce maxOrders by 1 for that delivery  agent

// router.get("/getOrders", getOrders);
// function getOrders(req, res) {

// }
module.exports = router;
