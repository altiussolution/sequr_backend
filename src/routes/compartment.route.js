const { CompartmentController } = require('../controllers')
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.post('/add', auth,CompartmentController.createCompartment);
route.get('/get', auth,CompartmentController.getCompartment);
route.get('/getCompartmentByCube',auth, CompartmentController.getCompartmentByCube);
route.put('/update/:id', auth,CompartmentController.updateCompartment);
route.get('/getCompartmentfilter', auth,CompartmentController.getCompartmentfilter);


module.exports = route;