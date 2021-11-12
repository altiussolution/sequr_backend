const { CartController } = require('../controllers');
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.post('/add', auth,CartController.addToCart);
route.get('/myCart',auth, CartController.myCart);
route.get('/itemHistory',auth, CartController.itemHistory);
route.put('/update', auth,CartController.updateCart);
route.put('/return', auth,CartController.return);
route.put('/deleteItemFromCart', auth,CartController.deleteItemFromCart);
route.post('/updateReturnTake',auth, CartController.updateCartAfterReturnTake);



module.exports = route;