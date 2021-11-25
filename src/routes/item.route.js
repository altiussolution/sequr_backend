let route = require('express').Router()
const { ItemController } = require('../controllers')
const auth = require('../middleware/auth.middleware')
var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, files, cb) {
    cb(null, './src/public/uploads')
  },
  filename: function (req, files, cb) {
    cb(null, files.originalname)
  }
})
var upload = multer({ storage: storage })

route.post('/add',auth, ItemController.addItem)
route.get('/get',auth, ItemController.getItem)
route.put('/update/:id', auth, ItemController.updateItem)
route.post('/upload', auth, upload.array('image-video'), ItemController.upload)
route.get(
  '/getItemByCategory/:category_id/:sub_category_id',
  auth,
  ItemController.getItemByCategory
)
route.delete('/delete/:id',auth, ItemController.deleteItems)
route.get('/getItemById/:item', auth, ItemController.getItemById)
//route.get('/getItemfilter',auth, ItemController.getItemfilter)
route.post(
  '/uploadImage',
  auth,
  upload.array('image-video'),
  ItemController.uploadImage
)
route.get('/getItemMachine/:category_id/:sub_category_id' ,ItemController.getItemMachine)

module.exports = route
