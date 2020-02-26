const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("./middleware_jwt");
const randomToken = require("random-token");

const User = require("../models/user.model");

const email = require("./send_email");

router.use(cors());

process.SECRET_KEY = "pogucoder";

router.post("/register", register);

function register(req, res) {
  const userData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    hashedPassword: req.body.hashedPassword,
    email: req.body.email
  };
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (user) {
        res.status(400).json({ error: "user already exist" });
      } else {
        bcrypt.hash(req.body.hashedPassword, 10, (err, hash) => {
          userData.hashedPassword = hash;
          User.create(userData)
            .then(user => {
              const gen_token = randomToken(55);

              email.send_verification_token(gen_token, user.email);

              var newValues = { $set: { token: gen_token } };

              User.updateOne(
                {
                  _id: user._id
                },
                newValues
              )
                .then(user => {
                  if (user) {
                    console.log("updated token");
                  } else {
                    console.log({ error: "token not updated" });
                  }
                })
                .catch(err => {
                  console.log("error:" + err.message);
                });

              res.json({
                status:
                  "registered and a link is sent to your email to get your email verified"
              });
            })

            .catch(err => {
              var arr = Object.keys(err["errors"]);
              var errors = [];
              for (i in arr) {
                errors.push(err["errors"][arr[i]].message);
              }
              console.log(errors);
              res.status(400).json({ error: errors });
            });
        });
      }
    })
    .catch(err => {
      var arr = Object.keys(err["errors"]);
      var errors = [];
      for (i in arr) {
        errors.push(err["errors"][arr[i]].message);
      }
      console.log(errors);
      res.status(401).json({ error: errors });
    });
}

router.post("/login", login);

function login(req, res) {
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.hashedPassword, user.hashedPassword)) {
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
          res.send(token);
        } else {
          // Passwords don't match
          res.status(401).json({ error: "Incorrect Password" });
        }
      } else {
        res.status(401).json({ error: "User does not exist" });
      }
    })
    .catch(err => {
      res.status(400).send("error: " + err);
    });
}

router.get("/profile", auth, profile);

function profile(req, res) {
  User.findOne({
    _id: req.user._id
  })
    .then(user => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).json({ error: "user does not exist" });
      }
    })
    .catch(err => {
      res.status(400).json("error:" + err);
    });
}

router.delete("/delete", delete_user);

function delete_user(req, res) {
  User.findOneAndDelete({
    email: req.body.email
  })
    .then(user => {
      if (user) {
        console.log("user deleted");
        res.send("user deleted");
      } else {
        res.status(404).json({ error: "not deleted" });
      }
    })
    .catch(err => {
      res.status(400).json("error:" + err);
    });
}

router.post("/get_verified", auth, resend_token);

function resend_token(req, res) {
  User.findOne({
    _id: req.user._id
  })
    .then(user => {
      if (user) {
        email.send_verification_token(user.token, user.email);
        res.json({ status: "resent verification token" });
      } else {
        res.json({ error: "Not a valid user" });
      }
    })
    .catch(err => {
      res.json({ error: err });
    });
}

router.get("/verify/:token", confirm_email);

function confirm_email(req, res) {
  let randToken = req.params.token;
  var newValues = { $set: { isVerified: true } };

  User.findOneAndUpdate(
    {
      token: randToken
    },
    newValues
  )
    .then(user => {
      if (user) {
        res.redirect("http://localhost:3000/#/Email_Verification/1");
      } else {
        res.json({ error: "not verified" });
        res.redirect("http://localhost:3000/#/Email_Verification/0");
      }
    })
    .catch(err => {
      res.json("error:" + err);
      res.redirect("http://localhost:3000/#/Email_Verification/0");
    });
}

router.post("/forgot_password", forgot_password);

function forgot_password(req, res) {
  let req_email = req.body.email;
  User.findOne({
    email: req_email
  }).then(user => {
    if (user) {
      const gen_token = randomToken(55);
      var newValues = { $set: { passwordResetToken: gen_token } };
      User.updateOne(
        {
          email: req_email
        },
        newValues
      )
        .then(user => {
          email.send_password_reset_token(gen_token, req_email);
          res
            .status(200)
            .send(
              "Email is sent to your email id with details to reset your password"
            );
        })
        .catch(err => {
          console.log(err, "Not updated!!!");
          res.status(404).send("Error");
        });
    } else {
      res.status(404).json({ error: "Email not found" });
    }
  });
}

router.get("/password_reset/:token", password_reset);

function password_reset(req, res) {
  let randToken = req.params.token;
  User.findOne({
    passwordResetToken: randToken
  }).then(user => {
    if (user) {
      const payload = {
        _id: user._id,
        email: user.email,
        firstname: user.firstname
      };
      let token = jwt.sign(payload, process.SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: 86400
      });
      res.send({ token: token });
    }
  });
}

router.post("/password_reset/reset/", auth, reset_password);

function reset_password(req, res) {
  bcrypt.hash(req.body.hashedPassword, 10, (err, hash) => {
    if (err) {
      console.log("ERROR : ", err);
      res.send("Error");
    } else {
      req_email = req.user.email;
      newValues = { $set: { hashedPassword: hash } };
      User.findOneAndUpdate(
        {
          email: req_email
        },
        newValues
      )
        .then(user => {
          res.send("Updated Passowrd");
        })
        .catch(err => {
          console.log("ERROR : ", err);
          res.send("Error");
        });
    }
  });
}

router.get("/show", show);

function show(req, res) {
  User.findOne({}).then(user => {
    res.send(user);
  });
}

module.exports = router;
