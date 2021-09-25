const { CartController } = require('../controllers');
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.post('/add', auth,CartController.addToCart);
route.get('/myCart',auth, CartController.myCart);
// route.get('/getBinByCube',BinController.getBinByCube);
route.put('/update/:id', auth,CartController.updateCart);
// route.put('/delete/:id', auth,BinController.deleteBin);


module.exports = route;