const {PurchaseOrderController} = require('../controllers')
let route = require('express').Router()
const auth = require("../middleware/auth.middleware");
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

route.post('/add',auth, PurchaseOrderController.addPurchaseOrder)
route.get('/get',auth,PurchaseOrderController.getPurchaseOrder)
route.put('/update/:id',auth,PurchaseOrderController.updatePurchaseOrder);
route.put('/delete/:id',auth,PurchaseOrderController.deletePurchaseOrder);
route.post('/upload',auth, upload.single('purchaseOrder'),PurchaseOrderController.upload)



module.exports = route;