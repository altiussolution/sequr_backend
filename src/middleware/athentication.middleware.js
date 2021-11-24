const { User } = require('../models/user.model')
const jwt = require("jsonwebtoken");
const config = process.env;

const authentication = async req => {
  var isAuthenticated = true
  var decoded = req.user
  await User.findById(decoded.user_id)
    .populate('role_id')
    .then(userDetails => {
      var permissions = userDetails.role_id.permission
      var urlArray = req.originalUrl.split('/')
      urlArray[2] = urlArray[2] == 'upload' ? 'add' : urlArray[2] // change upload string as add here
      var roleString = `${urlArray[1]}_${urlArray[2]}`
      var controllerName = urlArray[1]
      if (
        controllerName == 'employee' ||
        controllerName == 'item' ||
        controllerName == 'cube' ||
        controllerName == 'kitting' ||
        controllerName == 'return' ||
        controllerName == 'report' ||
        controllerName == 'log'
      ) {
        if (!permissions.includes(roleString)) {
          isAuthenticated = false
        }
      } else {
        isAuthenticated = true
      }
    })
  return isAuthenticated
}
const verifySuperAdmin = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers['authorization']
  try {
    if (!token) {
      return res.status(403).send('A token is required for authentication')
    } else {
      const decoded = jwt.verify(token, config.TOKEN_KEY)
      req.user = decoded
      var isValidUser = await User.findById(decoded.user_id)
        .populate('role_id')
        .exec()
      if (
        !isValidUser ||
        !isValidUser.active_status ||
        isValidUser.role_id.role_id != '$ SEQUR SUPERADMIN $'
      ) {
        return res.status(401).send('Not a valid user !!!')
      }
      //  else {
      //   // var isAthenticated = await authentication(req)
      //   // if(!isAthenticated){
      //     return res.status(401).send("Not Authorized");
      //   // }
      // }
    }
  } catch (err) {
    return res.status(401).send({ message: 'Invalid Token', error: err.name })
  }
  return next()
}
module.exports = { authentication, verifySuperAdmin }
