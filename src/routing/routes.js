var controllers = require('../controllers/index')

module.exports = ((app) => {
    app.get('/getUser', controllers.UsersController.getUserById);
});







