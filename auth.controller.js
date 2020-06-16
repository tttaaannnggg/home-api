require("dotenv").config();
const { JWTSECRET, BCRYPTSECRET } = process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = db => (req, res, next) => {
  console.log("logging in");
  const { user, pass } = req.body;
  const isAuthenticated = true;
  try {
    jwt.sign(
      { su: true, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
      JWTSECRET,
      (err, token) => {
        return res.json({ success: true, token });
      }
    );
  } catch (err) {
    return next(err);
  }
};

const validate = (req, res, next) => {
  if (!req.headers.authorization) {
    return next("no auth!");
  }
  const bearerToken = req.headers.authorization.split(" ")[1];
  console.log("validating token");
  jwt.verify(bearerToken, JWTSECRET, (err, token) => {
    console.log("got token", token);
    if (token.su) {
      return next();
    } else {
      return next(err);
    }
  });
};

module.exports = db => ({
  login: login(db),
  validate
});
