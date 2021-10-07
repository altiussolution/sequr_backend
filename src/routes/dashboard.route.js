const { DashboardController } = require('../controllers');
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.get('/getUsercount', auth,DashboardController.getUsercount);
route.get('/getBranchcount', auth,DashboardController.getBranchcount);
route.get('/getItemcount', auth,DashboardController.getItemcount);
module.exports = route;