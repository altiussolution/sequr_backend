let User = require('./routes/user.route')

module.exports = (app) => {
    app.use('/users', User)

}