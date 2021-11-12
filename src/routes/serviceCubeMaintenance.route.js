let route = require('express').Router()
const { ServiceCubeMaintenanceController } = require('../controllers/index');
const auth = require("../middleware/auth.middleware");

route.get('/cubeIdleHours',auth, ServiceCubeMaintenanceController.cubeIdleHours)
route.get('/filterCubeIdleHours',auth, ServiceCubeMaintenanceController.filterCubeIdleHours)

module.exports = route
