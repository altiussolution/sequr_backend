var authentication = require('./athentication.middleware')
const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];
  try {
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }else{
      const decoded = jwt.verify(token, config.TOKEN_KEY);
      req.user = decoded;
      var isAthenticated = await authentication(req)
      if(!isAthenticated){
        return res.status(401).send("Not Authorized");
      }
    }
    
  } catch (err) {
    return res.status(401).send({message : "Invalid Token", error : err.name});
  }
  return next();
};

module.exports = verifyToken;