const { BranchController } = require('../controllers');

let route = require('express').Router()

route.post('/add', BranchController.createBranch);
route.get('/get', BranchController.getBranch);



module.exports = route;