let Users = require('./users.route'),
Departments = require('./department.route')

module.exports = (app) => {
    app.use('/users', Users),
    app.use('/department', Departments)
}