require('dotenv').config();
const {JWTSECRET, BCRYPTSECRET} = process.env
const jwt = require('jsonwebtoken');

const setAuth = (req, res, next)=>{
  const {pass} = req.body;
  const isAuthenticated = true;
  try{
    const headers = req.headers.authorization;
    console.log(headers)
    jwt.sign({su: true, exp: Math.floor(Date.now()/1000) + 60*60*24*7 }, JWTSECRET, 
  }catch(err){
    return next(err);
  }
}

const validateAuth = (req, res, next)=>{
  console.log('bearer token header', req.headers.authorization)
  jwt.verify(
  return res.send('hello');
}

module.exports={
  setAuth, validateAuth
}
