const { DepartmentController } = require('../controllers')
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.post('/add', auth,DepartmentController.createDepartment);
route.get('/get',auth, DepartmentController.getDepartment);
route.put('/update/:id',auth, DepartmentController.updateDepartment);
route.put('/delete/:id',auth, DepartmentController.deleteDepartment);



module.exports = route;