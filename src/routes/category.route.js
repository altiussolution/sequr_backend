let route = require('express').Router()
var { CategoryController } = require('../controllers')
const auth = require('../middleware/auth.middleware')
var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

route.post('/add', auth, CategoryController.addCategory)
route.get('/get', auth, CategoryController.getCategory)
route.put('/update/:id', auth, CategoryController.updateCategory)
route.post(
  '/upload',
  auth,
  upload.single('category'),
  CategoryController.upload
)
route.delete('/delete/:id', auth, CategoryController.deleteCategory)
route.get('/getCategorylist', auth, CategoryController.getCategorylist)
route.get('/getCategoryfilter', auth, CategoryController.getCategoryfilter)
route.get(
  '/getCategoryMachine/:column_ids',
  auth,
  CategoryController.getCategoryMachine
)
route.get('/getUserCategory', auth, CategoryController.getUserCategory)

module.exports = route
