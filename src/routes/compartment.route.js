const { CompartmentController } = require('../controllers')
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.post('/add', auth,CompartmentController.createCube);
route.get('/get', auth,CompartmentController.getCube);
route.put('/update/:id', auth,CompartmentController.updateCube);



module.exports = route;