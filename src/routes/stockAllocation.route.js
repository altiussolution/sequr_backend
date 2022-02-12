const route = require('express').Router()
const { StockAllocationController } = require('../controllers')
const auth = require('../middleware/auth.middleware')

route.post('/add', StockAllocationController.allocateStock)
route.get('/get', StockAllocationController.getStockAllocations)
route.put('/update/:id', StockAllocationController.updateStockAllocation)
route.delete('/delete/:id', StockAllocationController.deleteStockAllocation)
//route.get('/getStockAllocationsfilter',auth, StockAllocationController.getStockAllocationsfilter)

module.exports = route 