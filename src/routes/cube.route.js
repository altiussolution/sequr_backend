const { CubeController } = require('../controllers')

let route = require('express').Router()

route.post('/add', CubeController.createCube);
route.get('/get', CubeController.getCube);
route.put('/update/:id', CubeController.updateCube);



module.exports = route;