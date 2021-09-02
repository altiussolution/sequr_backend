let route = require('express').Router()
var controllers = require('../controllers/index')

route.get('/get', controllers.ShiftController.get_shift)
route.post('/add', controllers.ShiftController.add_shift)
route.put('/delete', controllers.ShiftController.delete_shift)
route.put('/edit', controllers.ShiftController.edit_shift)

module.exports = route