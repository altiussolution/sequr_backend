let Users = require('./users.route')
let Roles = require('./roles.route')
module.exports = (app) => {
    app.use('/users', Users)
    app.use('/roles', Roles)
}