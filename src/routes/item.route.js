let route = require('express').Router()
var controllers = require('../controllers/index')
var multer = require("multer");
var upload = multer(
    {
  
      dest: '../upload/images'
    }
  );

route.post('/add', upload.array('files'), controllers.ItemController.addItem)
route.get('/get', controllers.ItemController.getItem)
route.put('/edit', upload.single('profile'), controllers.ItemController.editItem)


module.exports = route