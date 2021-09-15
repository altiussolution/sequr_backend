const {User} = require('../models/user.model')
const authentication  = async (req) =>{
    var isAuthenticated = true;
    var decoded= req.user
     await User.findById(decoded.user_id).populate("role_id").then(userDetails =>{
      var permissions = userDetails.role_id.permission
      var urlArray = req.originalUrl.split('/');
      urlArray[2] = (urlArray[2] == 'upload' ? 'add' : urlArray[2]) // change upload string as add here
      var roleString = `${urlArray[1]}_${urlArray[2]}`
      var controllerName = urlArray[1]
      if(controllerName == 'employee' || controllerName == 'item' || controllerName == 'cube' || controllerName == 'kitting' || controllerName == 'return' || controllerName == 'report' || controllerName == 'log'){
        if(!permissions.includes(roleString)){
            isAuthenticated = false;
        }
      }else{
        isAuthenticated = true;
      }
    })
    return isAuthenticated;
}

module.exports = authentication