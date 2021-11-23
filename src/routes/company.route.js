const { CompanyController } = require('../controllers')
const { verifySuperAdmin } = require('../middleware/athentication.middleware')
let route = require('express').Router()

route.post('/add', verifySuperAdmin, CompanyController.createCompany)
route.get('/get', verifySuperAdmin, CompanyController.getCompany)
route.put('/update/:id', verifySuperAdmin, CompanyController.updateCompany)
route.delete('/delete/:id', verifySuperAdmin, CompanyController.deleteCompany)
route.post('/addSuperAdmin', CompanyController.createCompany)
route.get('/getSuperAdmin', CompanyController.getCompany)
module.exports = route
