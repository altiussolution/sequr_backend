const { CompartmentController } = require('../controllers')
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.post('/add', auth,CompartmentController.createCompartment);
route.get('/get', auth,CompartmentController.getCompartment);
route.get('/getCompartmentByCube', CompartmentController.getCompartmentByCube);
route.put('/update/:id', auth,CompartmentController.updateCompartment);



module.exports = route;