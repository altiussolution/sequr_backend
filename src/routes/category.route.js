let route = require('express').Router()
var controllers = require('../controllers/index')
var multer = require("multer");
var upload = multer(
    {
  
      dest: '../upload/images'
    }
  );

route.post('/add', upload.single('profile'), controllers.CategoryController.addCategory)
route.get('/get', controllers.CategoryController.getCategory)
route.put('/edit', upload.single('profile'), controllers.CategoryController.editCategory)


module.exports = route