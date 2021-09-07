let route = require('express').Router()
var controllers = require('../controllers/index');
const auth = require("../middleware/auth.middleware");

route.post('/add', controllers.RolesController.createRole)
route.put('/permission/update/:id', controllers.RolesController.updatePermission)
route.get('/get', controllers.RolesController.getRoles)
route.put('/delete/:id', controllers.RolesController.deleteRole)


module.exports = route