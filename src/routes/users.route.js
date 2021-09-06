let route = require('express').Router()
var controllers = require('../controllers/index');
const auth = require("../middleware/auth.middleware");
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './upload/profilepic')
    },
    filename: function (req, file, cb) {
      cb(null, `${req.user.user_id}.${file.originalname.split('.').pop()}`)
    }
})
var upload = multer({ storage: storage })

route.post('/add', auth, controllers.UsersController.add)
route.post('/login',controllers.UsersController.login)
route.post('/upload',auth, upload.single('profile'),controllers.UsersController.upload)
module.exports = route 