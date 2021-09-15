let route = require('express').Router()
const { ItemController } = require('../controllers')
const auth = require("../middleware/auth.middleware");
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, files, cb) {
      cb(null, './src/public/uploads')
    },
    filename: function (req, files, cb) {
      cb(null, files.originalname)
    }
})
var upload = multer({ storage: storage })

route.post('/add', auth, ItemController.addItem)
route.get('/get', auth, ItemController.getItem)
route.put('/update/:id', auth, ItemController.updateItem)
route.post('/upload', upload.array('image-video'), ItemController.upload)
route.get('/getItemByCategory/:category_id', auth, ItemController.getItemByCategory)

module.exports = route
