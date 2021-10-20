const { DashboardController } = require('../controllers');
const auth = require("../middleware/auth.middleware");
let route = require('express').Router()

route.get('/getUsercount', auth,DashboardController.getUsercount);
route.get('/getBranchcount', auth,DashboardController.getBranchcount);
route.get('/getItemcount', auth,DashboardController.getItemcount);
route.get('/getCategorycount', auth,DashboardController.getCategorycount);
route.get('/getsubCategorycount', auth,DashboardController.getsubCategorycount);
route.get('/getRolescount', auth,DashboardController.getRolescount);
route.get('/getstockAllocationcount', auth,DashboardController.getstockAllocationcount);
route.get('/getBincount', auth,DashboardController.getBincount);
route.get('/getCompartmentcount', auth,DashboardController.getCompartmentcount);
route.get('/getKitcount', auth,DashboardController.getKitcount);
route.get('/getSuppliercount', auth,DashboardController.getSuppliercount);
route.get('/getDepartmentcount', auth,DashboardController.getDepartmentcount);
route.get('/getpurchaseOrdercount', auth,DashboardController.getPurchaseOrdercount);
route.get('/getCubecount', auth,DashboardController.getCubecount);


module.exports = route;