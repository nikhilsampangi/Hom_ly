var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User= require("../models/customer.model")
const jwt = require("jsonwebtoken");

function createToken(userData){
    const payload = {
        _id: userData._id,
        email: userData.email,
        firstname: userData.firstname
    };
    let token = jwt.sign(payload, process.SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: 86400
    });

    return token;
}

passport.use(
    new GoogleStrategy(
        {
            clientID: "362098581673-jv35bpdcjqe3rh3hv5d0sltut5j0b4ol.apps.googleusercontent.com",
            clientSecret: "01Tg1D7DO61Slmb8JYGWK-Dn",
            callbackURL: "http://localhost:8008/customer/auth/google/callback"
        },(accessToken, refreshToken, profile, done) => {
            const userInfo= profile._json;
            User.findOne({
                email: userInfo.email,
            })
            .then(user=>{
                if(!user){
                  const userData = {
                    firstName: userInfo.family_name,
                    lastName: userInfo.given_name,
                    email: userInfo.email,
                    googleOAuth: {
                        gid: userInfo.sub,
                        name: userInfo.name,
                        isRegistered: userInfo.email_verified 
                    }
                  };
                  User.create(userData)
                    .then(customer => {
                        const token= createToken(customer);
                        done(null, token);
                    })
                    .catch(err => {
                      var arr = Object.keys(err["errors"]);
                      var errors = [];
                      for (i in arr) {
                        errors.push(err["errors"][arr[i]].message);
                      }
                      done(errors[0], null);
                    });

                }else if(user.googleOAuth.gid === null){

                    const newValues= {
                        $set:{
                            googleOAuth:{
                                gid: userInfo.sub,
                                name: userInfo.name,
                                isVerified: userInfo.email_verified 
                            }
                        }
                    }

                    User.updateOne({
                        email: userInfo.email
                    }, newValues, (err, success)=>{
                        if(err){
                            done(err, null);
                        }else {
                            const token= createToken(user);
                            done(null, token);
                        }
                    })
                }else {
                    const token= createToken(user);
                    done(null, token);
                }
            })
            .catch(err=>{
                done(err, null);
            })
        }
    )
);
