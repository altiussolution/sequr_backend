let Users = require('./users.route')

module.exports = (app) => {
    app.use('/users', Users)
}