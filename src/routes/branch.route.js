const { BranchController } = require('../controllers');

let route = require('express').Router()

route.post('/add', BranchController.createBranch);
route.get('/get', BranchController.getBranch);
route.put('/update/:id', BranchController.updateBranch);
route.delete('/delete/:id', BranchController.deleteBranch);


module.exports = route;