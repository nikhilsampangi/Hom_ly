const jwt = require("jsonwebtoken");

process.SECRET_KEY = "hackit";

function auth(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).json({ msg: "token does not exist" });
  }

  try {
    const decoded = jwt.verify(token, process.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (event) {
    res.status(400).json({ msg: "token is not valid" });
  }
}

function auth_post(req, res) {
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).json({ msg: "token does not exist" });
  }

  try {
    const decoded = jwt.verify(token, process.SECRET_KEY);
    req.user = decoded;
    res.end();
  } catch (event) {
    res.status(400).json({ msg: "token is not valid" });
  }
}

(module.exports = auth), auth_post;
