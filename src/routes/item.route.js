let route = require('express').Router()
var controllers = require('../controllers/index')
var multer = require("multer");
var upload = multer(
    {
  
      dest: '../upload/images'
    }
  );

route.post('/add', upload.array('files'), controllers.ItemController.add_item)
route.get('/get', controllers.ItemController.get_item)
route.put('/edit', upload.single('profile'), controllers.ItemController.edit_item)


module.exports = route