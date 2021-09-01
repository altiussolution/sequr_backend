const { DepartmentController } = require('../controllers')

let route = require('express').Router()

route.post('/add', DepartmentController.createDepartment);
route.get('/get', DepartmentController.getDepartment);



module.exports = route;