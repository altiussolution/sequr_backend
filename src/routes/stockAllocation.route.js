const route = require('express').Router()
const { StockAllocationController } = require('../controllers')
const auth = require('../middleware/auth.middleware')

route.post('/add',auth, StockAllocationController.allocateStock)
route.get('/get',auth, StockAllocationController.getStockAllocations)
route.put('/update/:id',auth, StockAllocationController.updateStockAllocation)
route.delete('/delete/:id',auth, StockAllocationController.deleteStockAllocation)
route.get('/getStockAllocationsfilter',auth, StockAllocationController.getStockAllocationsfilter)

module.exports = route 