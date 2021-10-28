const { CubeController } = require('../controllers')
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.post('/add', auth,CubeController.createCube);
route.get('/get', auth,CubeController.getCube);
route.put('/update/:id', auth,CubeController.updateCube);
route.get('/getCubefilter', auth,CubeController.getCubefilter);



module.exports = route;