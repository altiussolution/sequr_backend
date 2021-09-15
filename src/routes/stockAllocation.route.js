const route = require('express').Router()
const { StockAllocationController } = require('../controllers')
const auth = require('../middleware/auth.middleware')

// route.get('/get', SubCategoryController.getsubCategory)
module.exports = route