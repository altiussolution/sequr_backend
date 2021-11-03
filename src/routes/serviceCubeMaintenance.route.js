let route = require('express').Router()
const { ServiceCubeMaintenanceController } = require('../controllers/index');
const auth = require("../middleware/auth.middleware");

route.get('/cubeIdleHours', ServiceCubeMaintenanceController.cubeIdleHours)
route.get('/filterCubeIdleHours', ServiceCubeMaintenanceController.filterCubeIdleHours)

module.exports = route
