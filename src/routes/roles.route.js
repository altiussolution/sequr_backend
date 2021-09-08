let route = require('express').Router()
const {RolesController} = require('../controllers/index');
const auth = require("../middleware/auth.middleware");

route.post('/add', auth, RolesController.createRole)
route.put('/permission/update/:id', auth, RolesController.updatePermission)
route.get('/get', auth, RolesController.getRoles)
route.put('/delete', auth, RolesController.deleteRole)


module.exports = route