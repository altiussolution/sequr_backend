const { BranchController } = require('../controllers');
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.post('/add', auth,BranchController.createBranch);
route.get('/get',auth, BranchController.getBranch);
route.put('/update/:id', auth,BranchController.updateBranch);
route.put('/delete/:id', auth,BranchController.deleteBranch);


module.exports = route;