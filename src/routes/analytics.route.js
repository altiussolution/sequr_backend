const { analyticsController } = require('../controllers');
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()


route.get('/columnShortage',auth, analyticsController.columnShortage);
route.get('/itemShortage',auth, analyticsController.itemShortage);


module.exports = route;