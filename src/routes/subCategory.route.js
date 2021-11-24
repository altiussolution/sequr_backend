const route = require('express').Router()
const { SubCategoryController } = require('../controllers')
const auth = require('../middleware/auth.middleware')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, files, cb) {
    cb(null, './src/public/uploads')
  },
  filename: function (req, files, cb) {
    cb(null, files.originalname)
  }
})
const upload = multer({ storage: storage })

route.get('/get',auth, SubCategoryController.getsubCategory)
route.post('/add', auth, SubCategoryController.addsubCategory)
route.put('/update/:id', auth, SubCategoryController.updatesubCategory)
route.post(
  '/upload',
  auth,
  upload.single('sub-category'),
  SubCategoryController.upload
)
route.get(
  '/getsubCategoryfilter',
  auth,
  SubCategoryController.getsubCategoryfilter
)
route.get(
  '/getSubCategoryMachine/:category_id',
  auth,
  SubCategoryController.getSubCategoryMachine
)
route.get('/getUsersubCategory', auth, SubCategoryController.getUsersubCategory)
route.delete('/delete/:id', auth, SubCategoryController.deletesubCategory)
module.exports = route
