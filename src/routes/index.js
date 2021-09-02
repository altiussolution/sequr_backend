let Users = require('./users.route')
let Category = require('./category.route')
let Item = require('./item.route')
let Region = require('./region.route')
let Shift = require('./shift.route')



module.exports = (app) => {
    app.use('/users', Users)
    app.use('/category', Category)
    app.use('/item', Item)
    app.use('/region', Region)
    app.use('/shift', Shift)


}