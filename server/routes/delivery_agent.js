const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("./middleware_jwt");
const randomToken = require("random-token");
const speakeasy = require('speakeasy');
const Agent = require("../models/deliveryAgent.model");
const email = require("./send_email");



const multer  = require('multer');

const store = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Images/agentLicense')
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



function gen_OTP(secret_token){
  
  var token = speakeasy.totp({
    secret: secret_token,
    encoding: 'base32'
  });

  return token;
}

function verify_OTP(secret_token, OTP){
  
  var tokenValidates = speakeasy.totp.verify({
    secret: secret_token,
    encoding: 'base32',
    token: OTP,
    window: 1
  });

  return tokenValidates;
}



router.post("/register", upload.single('licenseImage'), register);

function register(req, res) {

  Agent.findOne({
    email: req.body.email
  })
    .then(user => {
      if (user) {
        if(user.isRegistered === false){
          res.status(400).json({ error: "Please verify your account!!!", status: 0});  
        }
        else{
          res.status(400).json({ error: "Account already exist", status: 1 });
        }
      } 
      else {
        bcrypt.hash(req.body.hashedPassword, 10, (err, hash) => {

          var imagePath= req.file.path.replace(/\\/g, "/");

          var secret = speakeasy.generateSecret({length:20});

          const agentData = {
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            email: req.body.email,
            phoneNum: req.body.phonenumber,
            hashedPassword: hash,
            passwordResetToken: secret.base32,
            drivingLicense: imagePath
          };
          
          Agent.create(agentData)
            .then(agent => {

              var token = gen_OTP(agent.passwordResetToken);
              
              email.send_verification_token(token, agent.email);
              
              res.status(400).send("Please enter OTP!!!")

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

router.post("/verify_otp", verify)

function verify(req, res){
  Agent.findOne({
    email: req.body.email
  })
  .then(agent=>{
    if(!agent){
      res.status(404).json({error: "account does not exist, please register!!!"})
    }
    else{
      var tokenValidates = verify_OTP(agent.passwordResetToken, req.body.token);

      if(!tokenValidates){
        res.status(404).json({error: "INVALID OTP!!!"});
      }
      else{
        if(agent.isRegistered === false){
          const newValues= {$set: {isRegistered: true}}

          Agent.updateOne({_id: agent._id}, newValues, function(err, success) {
            if(err){
              res.status(404).json({error: "Something went wrong, please try again!!!"});
            }
            else{
              res.send("Successfully registered your account!!!");
            }
          });
        }
        else{
          const newValues= {$set: {isValidated: true}}

          Agent.updateOne({_id: agent._id}, newValues, function(err, success) {
            if(err){
              res.status(404).json({error: "Something went wrong, please try again!!!"});
            }
            else{
              res.send("Validated!!!");
            }
          });
        }
      }
    }
  })
  .catch(err=>{
    res.status(404).json({error: "Something went wrong, please try again!!!"});
  })
}

router.post("/send_otp", resend)

function resend(req, res){

  var secret = speakeasy.generateSecret({length:20})

  const newValues= {$set: {passwordResetToken: secret.base32}}

  Agent.updateOne({email: req.body.email}, newValues, function(err, success) {
    if(err){
      res.status(404).json({error: "Something went wrong, please try again!!!"});
    }
    else{  

      var token = gen_OTP(secret.base32);

      email.send_verification_token(token, req.body.email);

      res.status(400).send("OTP sent!!!");
    }
  });
}

router.post("/reset_password", reset)

function reset(req, res){

  Agent.findOne({
    email: req.body.email
  }).then(user=>{
      if(user.isValidated === true){
        bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
          if(err){
            res.status(404).json({error: "Something went wrong, please try again!!!"});
          }
          else{
      
            const newValues= {$set:{hashedPassword: hash, isValidated: false}}
            
            Agent.updateOne({email: req.body.email}, newValues, function(err, success) {
              if(err){
                res.status(404).json({error: "Something went wrong, please try again!!!"});
              }
              else{  
                res.status(400).send("Password updated!!!");
              }
            });
      
          }
        });
      }
      else{
        res.status(404).json({error: "Please verify with otp to update passwords"});
      }
  }).catch(err=>{
      res.status(404).json({error: "Something went wrong!!!"});
  })
}

router.get("/login", login);

function login(req, res) {
  Agent.findOne({
    email: req.body.email
  })
    .then(user => {
      if((!user)||(user.isRegistered === false)){
        res.status(401).json({ error: "User does not exist" });
      } 
      else{
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
      }
    })
    .catch(err => {
      res.status(400).send("error: " + err);
    });
}


module.exports = router;





