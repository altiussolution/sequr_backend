let route = require('express').Router()
var controllers = require('../controllers/index')
const auth = require("../middleware/auth.middleware");
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, files, cb) {
      cb(null, './upload/items')
    },
    filename: function (req, files, cb) {
      cb(null, files.originalname)
    }
})
var upload = multer({ storage: storage })

route.post('/add', controllers.ItemController.addItem)
route.get('/get', auth,controllers.ItemController.getItem)
route.put('/update/:id', auth, controllers.ItemController.updateItem)
route.post('/upload', auth, upload.array('image-video'), controllers.ItemController.upload)



module.exports = route