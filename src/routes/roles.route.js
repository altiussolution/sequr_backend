let route = require('express').Router()
var controllers = require('../controllers/index');

route.post('/add', controllers.RolesController.createRole)
route.put('/permission/update', controllers.RolesController.updatePermission)
module.exports = route