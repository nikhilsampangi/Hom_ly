const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware_jwt");
const speakeasy = require("speakeasy");
const Chef = require("../../models/chef.model");
const email = require("../send_email");
const passport = require('passport');
const passportSetup= require("../../config/gOAuth/chefPassport");
const chefValidate= require("../../joi_models/authValidation.model"); 
const passwordCheck= require('../../joi_models/passwordCheck.model'); 

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyA7nx22ZmINYk9TGiXDEXGVxghC43Ox6qA',
  Promise: Promise
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
    window: 1,
  });

  return tokenValidates;
}

router.post("/register", register);

function register(req, res) {
  Chef.findOne({
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
        
        const chefData = {
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            email: req.body.email,

            internalAuth:{
              hashedPassword: req.body.hashedPassword,
              passwordResetToken: secret.base32,
              phoneNum: req.body.phonenumber,
            }
          };

        const {error, value} = chefValidate.validate(chefData);

        if(error) {
        
          res.status(400).send({message: error.message});
        
        }else {

          bcrypt.hash(req.body.hashedPassword, 10, (err, hash) => {
            
            chefData.internalAuth.hashedPassword= hash;
            chefData.bio= req.body.bio;
            chefData.specialities= req.body.specialities;

            Chef.create(chefData)
            .then(chefCreated => {
              var token = gen_OTP(chefCreated.internalAuth.passwordResetToken);

              email.send_verification_token(token, chefCreated.email);

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
  Chef.findOne({
    email: req.body.email
  })
  .then(chefExist=>{
    if(!chefExist){
      res.status(400).send({
        message: "account does not exist, please register!!!",
        status: "1"
      });
    }else {

      var secret = speakeasy.generateSecret({ length: 20 });

      const newValues = { $set: { "internalAuth.passwordResetToken": secret.base32 } };
    
      Chef.updateOne({ 
        email: chefExist.email,
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
  Chef.findOne({
    email: req.body.email,
  })
    .then((chefExist) => {
      if (!chefExist) {
        res
          .status(400)
          .send({ message: "account does not exist, please register!!!" });
      } else {
        var tokenValidates = verify_OTP(
          chefExist.internalAuth.passwordResetToken,
          req.body.OTP
        );

        if (!tokenValidates) {
          res.status(400).send({ message: "INVALID OTP!!!" });
        } else {
            const newValues = { $set: { isVerified: true } };

            Chef.updateOne({ _id: chefExist._id }, newValues, function (
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
  Chef.findOne({
    email: req.body.email
  })
    .then(chefExist => {
      if (!chefExist) {
        res
          .status(400)
          .send({ message: "account does not exist, please register!!!" });
      } else {
        var tokenValidates = verify_OTP(
          chefExist.internalAuth.passwordResetToken,
          req.body.OTP
        );

        if (!tokenValidates) {
          res.status(400).send({ message: "INVALID OTP!!!" });
        } else {

            const newValues = { $set: {isValidated: true, isVerified: true} };

            Chef.updateOne({ _id: chefExist._id }, newValues, function (
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
  Chef.findOne({
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
  
              Chef.updateOne({ 
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
  console.log(req.body)
  Chef.findOne({
    email: req.body.email,
  })
    .then((user) => {
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
        } else {
          // Passwords don't match
          res.status(400).send({ message: "Incorrect Password" });
        }
      }
    })
    .catch((err) => {
      res
        .status(400)
        .send({ messsage: "Something went wrong, please try again!!! "+err });
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
  passport.authenticate("google", { failureRedirect: "/chef/auth/google", session: false }), (req, res) => {
      const token= req.user;
      console.log("\n"+token+"\n");
      res.redirect("http://localhost:3000/"+`${token}`);
  }
);

router.post('/getChefs', gmap)

async function gmap(req, res) {
  
  const lat = req.body.lat
  const lng = req.body.lng

  // await  Chef.find({})
  // .then(u => {
  //  chefsLocations = u
  // })

  var chefsLocations = [
    { 
      place: 'hyderabad',
      lat: 17.385044,
      lng: 78.486671
    },
    {
      place: 'kurnool',
      lat: 15.828126,
      lng: 78.037277
    },
    {
      place: 'gadwal',
      lat: 16.235001,
      lng: 77.799698
    },
    {
      place: 'warangal',
      lat: 17.971759,
      lng: 79.608924
    },
    {
      place: 'vijayawada',
      lat: 16.499847,
      lng: 80.656016
    }
  ];


  list = [];  // list to store all chef's data and distances   

  for(let i = 0; i < chefsLocations.length; i++){

    dest = chefsLocations[i].lat + ',' + chefsLocations[i].lng;      
    
    await googleMapsClient.directions({
      origin: lat + ',' + lng,
      destination: dest,
      units: 'metric'
    })
    .asPromise()
    .then(response => { // print response for more clarity

      var value = chefsLocations[i];
      distance = response.json.routes[0].legs[0].distance.text       // getting dist string in km from response 
      distArray = distance.split(" ");        // spliting the string like "283 km" by space to get distArray= ["283", "km"]
      value["distance"] = parseFloat(distArray[0]);     // changing data type to float from string 
      list.push(value);

    })
    .catch((err) => {
      console.log(err);
    });
  }

  list.sort((a,b)=>(a.distance > b.distance) ? 1: -1);    // sorting list according to dist
  res.send(list);

}  

router.get("/profile", auth, get_profile);

function get_profile(req, res) {
  Chef.findOne({
    _id: req.user._id,
  })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.json({ error: "chef does not exsist " });
      }
    })
    .catch((err) => {
      res.json("error: " + err);
    });
}

router.post("/edit_profile", edit_profile);

function edit_profile(req, res) {
  Chef.findOne({
    email: req.body.email,
  })
    .then((user) => {
      const userData = {
        $set: {
          firstName: req.body.firstname,
          lastName: req.body.lastname,
          phoneNum: req.body.phonenumber,
          bio: req.body.bio,
          specialities: req.body.specialities,
          Address: {
            Localty: req.body.localty,
            City: req.body.city,
            State: req.body.state,
            Pincode: req.body.pincode,
          },
        },
      };
      Chef.updateOne({ email: req.body.email }, userData, function (
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

router.post("/update_status", status_update);

function status_update(req, res) {
  const status = {
    $set: {
      workingStatus: req.body.status,
    },
  };
  Chef.updateOne({ email: req.body.email }, status)
    .then(res.status(200).send("Status Updated"))
    .catch((err) => {
      res
        .status(400)
        .send({ message: "Something went wrong, please try again!!!" });
    });
}

router.post("/add_item", auth, add_item);

function add_item(req, res) {
  Chef.updateOne(
    { _id: req.user._id },
    {
      $push: {
        menu: {
          itemName: req.body.itemName,
          itemDescr: req.body.itemDescr,
          itemCost: req.body.itemCost,
          isVeg: req.body.isVeg,
        },
      },
    }
  )
    .then(res.status(200).send("Item Added"))
    .catch(res.status(400).send("error: Item not added"));
}

router.post("/delete_item", auth, delete_item);

function delete_item(req, res) {
  Chef.updateOne(
    { _id: req.user._id },
    {
      $pull: {
        menu: {
          itemName: req.body.itemName,
        },
      },
    }
  )
    .then(res.status(200).send("Item Removed"))
    .catch(res.status(400).send("error: Item not removed"));
}

router.get("/avail_items", avail_items);

function avail_items(req, res) {
  Chef.find(
    { workingStatus: true },
    { firstName: 1, lastName: 1, menu: 1 }
  ).then((items) => {
    if (items) {
      res.send(items);
    } else {
      res.json({ error: "no chefs are cooking right now" });
    }
  });

  // Chef.find({ workingStatus: { $eq: true } })
  //   .then((chefs) => {
  //     if (chefs) {
  //       res.send(chefs);
  //     } else {
  //       res.json({ error: "no chefs are cooking right now" });
  //     }
  //   })
  //   .catch((err) => {
  //     res.json("error: " + err);
  //   });

}

module.exports = router;
