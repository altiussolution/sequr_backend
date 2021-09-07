let route = require('express').Router()
var controllers = require('../controllers/index');
const auth = require("../middleware/auth.middleware");

route.post('/add', auth, controllers.RolesController.createRole)
route.put('/permission/update/:id', auth, controllers.RolesController.updatePermission)
route.get('/get', auth, controllers.RolesController.getRoles)
route.put('/delete/:id', auth, controllers.RolesController.deleteRole)


module.exports = route