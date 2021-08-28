let Users = require('./routes/users.route')

module.exports = (app) => {
    app.use('/users', Users)
}