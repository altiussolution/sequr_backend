let route = require('express').Router()
var controllers = require('../controllers/index');
const auth = require("../middleware/auth.middleware");

route.post('/add', controllers.RolesController.createRole)
route.put('/permission/update', controllers.RolesController.updatePermission)
route.get('/get', controllers.RolesController.getRoles)
route.put('/delete', controllers.RolesController.deleteRole)


module.exports = route