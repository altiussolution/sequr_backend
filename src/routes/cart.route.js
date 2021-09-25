const { CartController } = require('../controllers');
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.post('/add', auth,CartController.addToCart);
route.get('/myCart',auth, CartController.myCart);
route.get('/get',auth, CartController.getCart);
route.put('/update/:id', auth,CartController.updateCart);

module.exports = route;