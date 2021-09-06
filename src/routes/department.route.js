const { DepartmentController } = require('../controllers')

let route = require('express').Router()

route.post('/add', DepartmentController.createDepartment);
route.get('/get', DepartmentController.getDepartment);
route.put('/update/:id', DepartmentController.updateDepartment);
route.delete('/delete/:id', DepartmentController.deleteDepartment);



module.exports = route;