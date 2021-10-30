const { SupplierController } = require('../controllers');
let route = require('express').Router()

route.post('/add',SupplierController.createSupplier);
route.get('/get', SupplierController.getSupplier);
route.put('/update/:id',SupplierController.updateSupplier);
route.put('/delete/:id',SupplierController.deleteSupplier);
route.get('/getSupplierfilter', SupplierController.getSupplierfilter);

module.exports = route;