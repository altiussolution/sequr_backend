var User = require('../models/user.model')
const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
    // User.findById(decoded.user_id).populate("role_id").then(userDetails =>{
    //   var permissions = userDetails.role_id.permission
    //   var urlArray = req.originalUrl.split('/');
    //   var roleString = `${urlArray[1]}_${urlArray[2]}`
    //   var controllerName = urlArray[1]
    //   if(controllerName == 'employee' || controllerName == 'item' || controllerName == 'cube' || controllerName == 'kitting' || controllerName == 'return' || controllerName == 'report' || controllerName == 'log'){
    //     if(!permissions.includes(roleString)){
    //       return res.status(403).send("Permission Required Not Authorized");
    //     }
    //   }
      
    // })
    
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;