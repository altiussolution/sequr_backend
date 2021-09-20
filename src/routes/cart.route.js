const { CartController } = require('../controllers');
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.post('/add', auth,CartController.addToCart);
// route.get('/get',auth, BinController.getBin);
// route.get('/getBinByCube',BinController.getBinByCube);
// route.put('/update/:id', auth,BinController.updateBin);
// route.put('/delete/:id', auth,BinController.deleteBin);


module.exports = route;