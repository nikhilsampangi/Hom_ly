const jwt = require("jsonwebtoken");

process.SECRET_KEY = "hackit";

function auth(req, res, next) {
  const token= req.header('Authorization');

    jwt.verify(token, process.SECRET_KEY, function(err, decoded) {
        if(err){
            res.status(400).send({message: err});
        } else{
            const data= decoded;
            req.user= data;
            next(); 
        }
    });
}

module.exports = auth;
