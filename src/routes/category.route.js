let route = require('express').Router()
var controllers = require('../controllers/index')
const auth = require("../middleware/auth.middleware");
var multer = require("multer"); 
var upload = multer(
    {
  
      dest: '../upload/images'
    }
  );

route.post('/add', auth,upload.single('profile'), controllers.CategoryController.addCategory)
route.get('/get', auth,controllers.CategoryController.getCategory)
route.put('/edit/:id', auth,upload.single('profile'), controllers.CategoryController.editCategory)


module.exports = route