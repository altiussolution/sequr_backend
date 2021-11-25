const { DepartmentController } = require('../controllers')
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.post('/add', auth,DepartmentController.createDepartment);
route.get('/get',auth, DepartmentController.getDepartment);
route.put('/update/:id',auth, DepartmentController.updateDepartment);
route.delete('/delete/:id',auth, DepartmentController.deleteDepartment);
route.post('/addSuperAdmin', DepartmentController.createDepartment);
route.get('/getSuperAdmin', DepartmentController.getDepartment);



module.exports = route;