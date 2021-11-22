const { CompanyController } = require('../controllers');
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.post('/add', auth,CompanyController.createCompany);
route.get('/get',auth, CompanyController.getCompany);
route.put('/update/:id', auth,CompanyController.updateCompany);
route.delete('/delete/:id', auth,CompanyController.deleteCompany);



module.exports = route;