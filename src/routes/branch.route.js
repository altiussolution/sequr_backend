const { BranchController } = require('../controllers');
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.post('/add', auth,BranchController.createBranch);
route.get('/get', auth,BranchController.getBranch);

module.exports = route;