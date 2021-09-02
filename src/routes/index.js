let Users = require('./users.route')
let Roles = require('./roles.route')
let Category = require('./category.route')
let Item = require('./item.route')
let Region = require('./region.route')
let Shift = require('./shift.route')

module.exports = (app) => {
    app.use('/users', Users)
    app.use('/roles', Roles)
    app.use('/category', Category)
    app.use('/item', Item)
    app.use('/region', Region)
    app.use('/shift', Shift)
}