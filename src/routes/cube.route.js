const { CubeController } = require('../controllers')
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.post('/add', auth,CubeController.createCube);
route.get('/get', auth,CubeController.getCube);
route.put('/update/:id', auth,CubeController.updateCube);
route.get('/getCubefilter', auth,CubeController.getCubefilter);
<<<<<<< HEAD
route.delete('/delete/:id',auth,CubeController.deleteCube);
=======
route.delete('/delete/:id', auth,CubeController.deleteCube);
>>>>>>> 16998c59390e2f4fd3952bde6cac886dadc43c69



module.exports = route;