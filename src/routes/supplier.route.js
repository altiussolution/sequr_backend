const { SupplierController } = require('../controllers');
let route = require('express').Router()

route.post('/add',SupplierController.createSupplier);
route.get('/get', SupplierController.getSupplier);
route.put('/update/:id',SupplierController.updateSupplier);
route.put('/delete/:id',SupplierController.deleteSupplier);


module.exports = route;