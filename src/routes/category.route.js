let route = require('express').Router()
var controllers = require('../controllers/index')
var multer = require("multer");
var upload = multer(
    {
  
      dest: '../upload/images'
    }
  );

route.post('/add', upload.single('profile'), controllers.CategoryController.add_category)
route.get('/get', controllers.CategoryController.get_category)
route.put('/edit', upload.single('profile'), controllers.CategoryController.edit_category)


module.exports = route