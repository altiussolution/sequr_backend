let route = require('express').Router()
var controllers = require('../controllers/index')
const auth = require("../middleware/auth.middleware");

route.get('/get', auth , controllers.ShiftController.getShift)
route.post('/add', auth , controllers.ShiftController.addShift)
route.put('/delete/:id', auth , controllers.ShiftController.deleteShift)
route.put('/update/:id', auth, controllers.ShiftController.updateShift)

module.exports = route