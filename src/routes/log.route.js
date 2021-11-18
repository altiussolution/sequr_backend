const { LogController } = require('../controllers')
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.get('/get', LogController.getLog);


module.exports = route;