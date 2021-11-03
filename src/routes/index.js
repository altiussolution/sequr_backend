let Users = require('./users.route')
let Roles = require('./roles.route')
let Category = require('./category.route')
let Item = require('./item.route')
let Region = require('./region.route')
let Shift = require('./shift.route')
let Departments = require('./department.route')
let Branch = require('./branch.route')
let Cube = require('./cube.route')
let Bin = require('./bin.route');
let Kitting = require('./kitting.route')
let Compartment = require('./compartment.route');
const SubCategory = require('./subCategory.route')
let PurchaseOrder = require('./purchaseOrder.route')
let Supplier = require('./supplier.route')
const StockAllocation = require('./stockAllocation.route')
const Cart = require('./cart.route')
const Dashboard = require('./dashboard.route')
const ServiceCubeMaintenance = require('./serviceCubeMaintenance.route')
const Analytics = require('./analytics.route')

module.exports = (app) => {
    app.use('/employee', Users)
    app.use('/roles', Roles)
    app.use('/category', Category)
    app.use('/item', Item)
    app.use('/region', Region)
    app.use('/shift', Shift)
    app.use('/department', Departments)
    app.use('/branch', Branch)
    app.use('/cube', Cube)
    app.use('/bin', Bin)
    app.use('/kitting', Kitting)
    app.use('/compartment', Compartment)
    app.use('/subCategory', SubCategory)
    app.use('/purchaseOrder', PurchaseOrder)
    app.use('/supplier', Supplier)
    app.use('/allocation',StockAllocation)
    app.use('/cart',Cart)
    app.use('/dashboard',Dashboard)
    app.use('/ServiceCubeMaintenance',ServiceCubeMaintenance)
    app.use('/analytics',Analytics)
}
