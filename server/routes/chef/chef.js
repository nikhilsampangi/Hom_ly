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

//File Upload
var multer  = require('multer');
var path = require('path');
var upload = multer({ dest: 'uploads/chefMenuItems' });

//ElasticSearch
const elastic = require("../elasticSearch");

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

                // indexing chef in elastic search
                const payload = {
                  id: chefExist._id,
                  name: chefExist.firstName+" "+chefExist.lastName,
                  place: chefExist.Address.Localty,
                  rating: chefExist.rating,
                  pin : {
                    location : {
                        lat : 16.47749,//chef.currentPosition.latitude
                        lon : 80.6055627,// chef.currentPosition.longitude
                    }
                  }
                }

                elastic.indexing("chefs", chefExist._id, payload, (err,response) => {
                  if(err){
                    console.log("\nNot Indexed:-\n"+ err+"\n");
                  }else{
                    console.log("Chef Indexed");
                  }
                })

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

var storage = multer.diskStorage({
  destination: 'uploads/chefMenuItems',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})
 
var upload = multer({ storage: storage }).single('dishPic');
router.post("/add_item",auth, upload, add_item); // add auth, upload

function add_item(req, res) {
    Chef.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $push: {
          menu: {
            itemName: req.body.itemName,
            itemDescr: req.body.itemDescr,
            itemCost: req.body.itemCost,
            isVeg: req.body.isVeg,
            dishPic: 'uploads/'+ req.file.filename
          },
        },
      },
      {new: true },(err, chefDocs) =>{
        if(err){
          res.status(400).send({message: "Item not added"})
        }else{
          chefDocs.menu.forEach((dish) => {
            if(dish.itemName === req.body.itemName){
              console.log("-----: ", dish)
              
              // indexing
              const payload ={
                    chefId: req.user._id,
                    chefName: req.user.fullname,
                    dishId: dish._id,
                    dishName: dish.itemName,
                    dishPic: dish.dishPic,
                    pin : {
                      location : {
                          lat : 16.47749,//chef.location.coordinates
                          lon : 80.6055627,// chef.location.coordinates
                      }
                    }
              }
              elastic.indexing("menu", dish._id, payload, (err, resp) => {
                if(err){
                  // res.status(400).send("error: not indexed")
                  console.log("\nerror: not indexed\n")
                }else{
                  // res.status(200).send("Item added");
                  console.log("\nItem indexed\n")
                }
              })
              res.status(200).send({message: "Item added"})
              
            }
          })
          
        }
      }
    )

    
}


router.post("/delete_item", auth, delete_item);

function delete_item(req, res) {
  elastic.deleteDocs("menu", "5eaab9a0c00181206c1e7c4e", (err,response) => {
    if(err){
      res.status(400).send("error: Item not removed")
    }else{
      Chef.updateOne(
        { _id: req.user._id },
        {
          $pull: {
            menu: {
              itemName: req.body.itemName,
            },
          },
        }
      ).then(resp=>{
        res.status(200).send({message: "Item Removed"}) 
      }).catch(err=>{
          res.status(400).send({message: "Item not removed"})
        });
    }
  })
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
