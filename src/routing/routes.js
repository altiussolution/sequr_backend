var IndexController = require('../controllers/index');

var UserController = require('../controllers/users.controller');




module.exports = ((app) => {
    // app.get('/getUser', UserController.getUserById);
    app.get('/getUser', IndexController.Controllers.SampleController.getUserById);

});







