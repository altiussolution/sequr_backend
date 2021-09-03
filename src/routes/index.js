let Users = require('./users.route'),
Departments = require('./department.route'),
Branch = require('./branch.route')

module.exports = (app) => {
    app.use('/users', Users),
    app.use('/department', Departments),
    app.use('/branch', Branch)
}