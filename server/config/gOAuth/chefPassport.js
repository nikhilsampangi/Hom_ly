var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const Chef= require("../../models/chef.model");
const jwt = require("jsonwebtoken");

function createToken(chefData){
    const payload = {
        _id: chefData._id,
        email: chefData.email,
        firstname: chefData.firstname+" "+chefData.lasttname,
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
            callbackURL: "http://localhost:8008/chef/auth/google/callback"
        },(accessToken, refreshToken, profile, done) => {
            const chefInfo= profile._json;
            Chef.findOne({
                email: chefInfo.email,
            })
            .then(chef=>{
                if(!chef){
                  const chefData = {
                    firstName: chefInfo.family_name,
                    lastName: chefInfo.given_name,
                    email: chefInfo.email,
                    googleOAuth: {
                        gid: chefInfo.sub,
                        name: chefInfo.name,
                        isRegistered: chefInfo.email_verified 
                    }
                  };
                  Chef.create(chefData)
                    .then(userCreated => {
                        const token= createToken(userCreated);
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

                }else if(chef.googleOAuth.gid === null){

                    const newValues= {
                        $set:{
                            googleOAuth:{
                                gid: chefInfo.sub,
                                name: chefInfo.name,
                                isRegistered: chefInfo.email_verified 
                            }
                        }
                    }

                    Chef.updateOne({
                        email: chefInfo.email
                    }, newValues, (err, success)=>{
                        if(err){
                            done(err, null);
                        }else {
                            const token= createToken(chef);
                            done(null, token);
                        }
                    })
                }else {
                    const token= createToken(chef);
                    done(null, token);
                }
            })
            .catch(err=>{
                done(err, null);
            })
        }
    )
);
