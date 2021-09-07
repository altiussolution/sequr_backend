let route = require('express').Router()
var controllers = require('../controllers/index')
const auth = require("../middleware/auth.middleware");

route.get('/get', auth , controllers.ShiftController.getShift)
route.post('/add', auth , controllers.ShiftController.addShift)
route.put('/delete/:id', auth , controllers.ShiftController.deleteShift)
route.put('/edit/:id', auth, controllers.ShiftController.editShift)

module.exports = route