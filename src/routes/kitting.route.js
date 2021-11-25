const { KitController } = require('../controllers');
const auth = require("../middleware/auth.middleware");
var multer = require("multer");
let route = require('express').Router()
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/public/uploads') 
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

route.post('/add', auth , KitController.createKit);
route.get('/get', auth , KitController.getKit);
route.put('/update/:id', auth, KitController.updateKit);
route.put('/delete/:id', auth, KitController.deleteKit);
route.post('/upload', auth , upload.single('kit'), KitController.upload);
route.post('/addKitToCart/:id', auth, KitController.addKitToCart);
route.post('/deleteKitFromCart/:cart_id/:kit_id', auth, KitController.deleteKitFromCart);
//route.get('/getoldkit', auth , KitController.getoldKit);


module.exports = route;  