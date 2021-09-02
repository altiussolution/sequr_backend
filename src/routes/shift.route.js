let route = require('express').Router()
var controllers = require('../controllers/index')

route.get('/get', controllers.ShiftController.getShift)
route.post('/add', controllers.ShiftController.addShift)
route.put('/delete', controllers.ShiftController.deleteShift)
route.put('/edit', controllers.ShiftController.editShift)

module.exports = route