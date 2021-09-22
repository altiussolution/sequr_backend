const {PurchaseOrderController} = require('../controllers')
let route = require('express').Router()
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

route.post('/add', PurchaseOrderController.addPurchaseOrder)
route.get('/get',PurchaseOrderController.getPurchaseOrder)
route.put('/update/:id',PurchaseOrderController.updatePurchaseOrder);
route.put('/delete/:id',PurchaseOrderController.deletePurchaseOrder);
route.post('/upload', upload.single('purchaseOrder'),PurchaseOrderController.upload)



module.exports = route;