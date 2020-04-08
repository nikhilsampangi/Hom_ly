const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware_jwt");
const speakeasy = require("speakeasy");

const Chef = require("../../models/chef.model");

const email = require("../send_email");

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
    .then((chef) => {
      if (chef) {
        // In front-end check the status,
        // if status is '1' call send_otp api and load otp component,

        if (chef.isRegistered === false) {
          res
            .status(200)
            .send({ message: "Please verify your account!!!", status: "1" });
        } else {
          res.status(400).send({ message: "Account already exist" });
        }
      } else {
        bcrypt.hash(req.body.hashedPassword, 10, (err, hash) => {
          var secret = speakeasy.generateSecret({ length: 20 });

          const chefData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNum: req.body.phoneNumber,
            hashedPassword: hash,
            passwordResetToken: secret.base32,
            bio: req.body.bio,
            specialities: req.body.specialities,
          };

          Chef.create(chefData)
            .then((user) => {
              var token = gen_OTP(user.passwordResetToken);

              email.send_verification_token(token, user.email);

              res
                .status(200)
                .send({ message: "Please enter OTP!!!", status: "1" });
            })
            .catch((err) => {
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
    .catch((err) => {
      res
        .status(400)
        .send({ message: "Something went wrong, please try again!!!" });
    });
}

router.post("/verify_otp", verify);

function verify(req, res) {
  Chef.findOne({
    email: req.body.email,
  })
    .then((chef) => {
      if (!chef) {
        res
          .status(400)
          .send({ message: "account does not exist, please register!!!" });
      } else {
        var tokenValidates = verify_OTP(chef.passwordResetToken, req.body.OTP);

        if (!tokenValidates) {
          res.status(400).send({ message: "INVALID OTP!!!" });
        } else {
          if (chef.isRegistered === false) {
            const newValues = { $set: { isRegistered: true } };

            Chef.updateOne({ _id: chef._id }, newValues, function (
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
          } else {
            const newValues = { $set: { isValidated: true } };

            Chef.updateOne({ _id: chef._id }, newValues, function (
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
  var secret = speakeasy.generateSecret({ length: 20 });

  const newValues = { $set: { passwordResetToken: secret.base32 } };

  Chef.updateOne({ email: req.body.email }, newValues, function (err, success) {
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

router.post("/reset_password", reset);

function reset(req, res) {
  Chef.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (user.isValidated === true) {
        bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
          if (err) {
            res
              .status(400)
              .send({ message: "Something went wrong, please try again!!!" });
          } else {
            const newValues = {
              $set: { hashedPassword: hash, isValidated: false },
            };

            Chef.updateOne({ email: req.body.email }, newValues, function (
              err,
              success
            ) {
              if (err) {
                res.status(400).send({
                  message: "Something went wrong, please try again!!!",
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
  Chef.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user || user.isRegistered === false) {
        res.status(400).send({ message: "Account does not exist" });
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
        } else {
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
