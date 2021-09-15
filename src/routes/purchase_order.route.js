const {PurchaseOrderController} = require('../controllers')
let route = require('express').Router()


route.post('/add', PurchaseOrderController.addPurchaseOrder)
route.get('/get',PurchaseOrderController.getPurchaseOrder)




module.exports = route;