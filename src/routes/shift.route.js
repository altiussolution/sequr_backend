let route = require('express').Router()
var controllers = require('../controllers/index')
const auth = require("../middleware/auth.middleware");

route.get('/get', auth , controllers.ShiftController.getShift)
route.post('/add', auth , controllers.ShiftController.addShift)
route.put('/delete', auth , controllers.ShiftController.deleteShift)
route.put('/edit', auth ,controllers.ShiftController.editShift)

module.exports = route