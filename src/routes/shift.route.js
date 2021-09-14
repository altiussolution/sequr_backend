const route = require('express').Router()
const { ShiftController } = require('../controllers')
const auth = require('../middleware/auth.middleware');

route.get('/get', auth, ShiftController.getShift)
route.post('/add', auth, ShiftController.addShift)
route.put('/delete/:id', auth, ShiftController.deleteShift)
route.put('/update/:id', auth, ShiftController.updateShift)

module.exports = route
