const { SupplierController } = require('../controllers');
let route = require('express').Router()
const auth = require("../middleware/auth.middleware");

route.post('/add',auth,SupplierController.createSupplier);
route.get('/get',auth, SupplierController.getSupplier);
route.put('/update/:id',auth,SupplierController.updateSupplier);
route.delete('/delete/:id',auth,SupplierController.deleteSupplier);
route.get('/getSupplierfilter',auth, SupplierController.getSupplierfilter);

module.exports = route;