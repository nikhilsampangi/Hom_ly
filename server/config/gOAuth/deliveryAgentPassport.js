var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: "362098581673-jv35bpdcjqe3rh3hv5d0sltut5j0b4ol.apps.googleusercontent.com",
            clientSecret: "01Tg1D7DO61Slmb8JYGWK-Dn",
            callbackURL: "http://localhost:3001/deliveryAgent/auth/google/callback"
        },(accessToken, refreshToken, profile, done) => {
            var userData = {
                email: profile.emails[0].value,
                name: profile.displayName,
                token: accessToken
            };
            done(null, userData);
        }
    )
);
