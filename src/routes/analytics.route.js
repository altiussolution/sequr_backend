const { analyticsController } = require('../controllers');
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()


route.get('/columnShortage', analyticsController.columnShortage);
route.get('/itemShortage', analyticsController.itemShortage);


module.exports = route;