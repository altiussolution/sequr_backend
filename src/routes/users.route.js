let route = require('express').Router()
var controllers = require('../controllers/index');
const auth = require("../middleware/auth.middleware");
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, `${req.user.user_id}.${file.originalname.split('.').pop()}`)
    }
})
var upload = multer({ storage: storage })

route.post('/add', controllers.UsersController.add)
route.post('/login', controllers.UsersController.login)
route.post('/upload',auth, upload.single('profile'),controllers.UsersController.upload)
route.put('/update', auth, controllers.UsersController.update)
route.put('/delete', auth, controllers.UsersController.delete)
route.get('/get', auth, controllers.UsersController.listEmployees)
route.post('/forgotPassword', controllers.UsersController.forgotPassword)
route.put('/resetPassword/:user_id/:token', controllers.UsersController.resetPassword)
route.get('/userProfile/:id',auth,controllers.UsersController.userProfile);
module.exports = route 