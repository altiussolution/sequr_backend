let route = require('express').Router()
var controllers = require('../controllers/index');
const auth = require("../middleware/auth.middleware");

route.post('/add', auth, controllers.RolesController.createRole)
route.put('/permission/update',auth, controllers.RolesController.updatePermission)
module.exports = route