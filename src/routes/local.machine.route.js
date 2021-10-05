const {  LocalMachineController } = require('../controllers')
let route = require('express').Router()

route.post('/machineAccess', LocalMachineController.machineAccess); 

module.exports = route;