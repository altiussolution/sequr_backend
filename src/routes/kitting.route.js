const { KitController } = require('../controllers');
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.post('/add', KitController.createKit);
route.get('/get', KitController.getKit);
route.put('/update/:id', KitController.updateKit);
route.put('/delete/:id', KitController.deleteKit);


module.exports = route;