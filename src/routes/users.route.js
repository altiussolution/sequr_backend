let route = require('express').Router()
var controllers = require('../controllers/index');

route.post('/add', controllers.UsersController.add)
route.post('/login',controllers.UsersController.login)
module.exports = route