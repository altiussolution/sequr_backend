let route = require('express').Router()
var controllers = require('../controllers/index');

route.post('/add', controllers.UsersController.add)
module.exports = route