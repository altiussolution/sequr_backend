const route = require('express').Router()
const { StockAllocationController } = require('../controllers')
const auth = require('../middleware/auth.middleware')

route.post('/add', StockAllocationController.allocateStock)
module.exports = route 