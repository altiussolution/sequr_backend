var IndexController = require('../controllers/index').Controllers




module.exports = ((app) => {
    app.get('/getUser', IndexController.SampleController.getUserById);

});







