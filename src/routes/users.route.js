let route = require('express').Router()
var controllers = require('../controllers/index');

route.get('/getusers', controllers.UsersController.getUserById)
module.exports = route