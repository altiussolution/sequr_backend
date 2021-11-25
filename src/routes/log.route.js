const { LogController } = require('../controllers')
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.get('/get',auth, LogController.getLog);
route.get('/getUserTakenQuantity', LogController.getUserTakenQuantity);



module.exports = route;