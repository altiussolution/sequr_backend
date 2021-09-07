let route = require('express').Router()
var controllers = require('../controllers/index')
const auth = require("../middleware/auth.middleware");
var multer = require("multer");
var upload = multer(
    {
  
      dest: '../upload/images'
    }
  );

route.post('/add',auth, upload.array('files'), controllers.ItemController.addItem)
route.get('/get', auth,controllers.ItemController.getItem)
route.put('/edit/:id', auth,upload.single('profile'), controllers.ItemController.editItem)


module.exports = route