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
const SubCategory = require('./sub_category.route')
let Supplier = require('./supplier.route')


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
  app.use('/supplier', Supplier)
}
