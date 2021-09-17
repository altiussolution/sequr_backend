const { purchaseOrderModel } = require("../models");
const {error_code,appRouteModels} = require("../utils/enum.utils")

exports.addPurchaseOrder = (async (req, res) => {
    try{
        var purchase_order = new purchaseOrderModel(req.body);
        var isPurchaseOrderExist = await purchaseOrderModel.findOne({ $or: [{po_number : req.body.po_number} ] }).exec()
        if(!isPurchaseOrderExist){
         purchase_order.save((err) =>{  
             if(!err){
                 res.status(200).send({ success: true, message: 'PurchaseOrder Created Successfully!' });
             }else{
                 var errorMessage = (err.code == error_code.isDuplication ? 'Duplication occured in PurchaseOrder po_number' : err)
                 res.status(200).send({
                     success: false,
                     message: errorMessage
                 });
             }
            })
        }else{
         res.status(200).send({
             success: false,
             message: 'Given PurchaseOrder Already Exist'
         });
 
        }
       
    }catch(err){
     res.status(201).send({success: false, error : err.name})
    }
 })
 
exports.getPurchaseOrder = (async (req, res) => {
    try {
        purchaseOrderModel.find({ active_status: 1 }, (err, purchase_order) => {
            if (!err) {
                res.send({
                    status: 'Success',
                    data: purchase_order
                });
            }
            else {
                res.send(err.message);
            }
        })
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})
exports.updatePurchaseOrder = (async (req, res) => {
    console.log(req.params.id)
    try{
        purchase_orderModel.findByIdAndUpdate(req.params.id, req.body).then(purchase_orderUpdate =>{
            res.status(200).send({ success: true, message: 'PurchaseOrder Updated Successfully!' });
        }).catch(error =>{
            res.status(200).send({ success: false, error: error, message : 'An Error Occured' });
        }) 
    }catch(err){
        res.status(200).send({ success: false, error: err, message : 'An Error Catched' });  
    }
})
exports.deletePurchaseOrder = (req, res) => {
    try {
        purchase_orderModel.findByIdAndUpdate(req.params.id, { active_status: 0 }).then(purchase_order => {
            res.status(200).send({ success: true, message: 'PurchaseOrder Deleted Successfully!' });
        }).catch(err => {
            res.status(200).send({ success: false, message: 'PurchaseOrder Not Found' });
        })
    }
    catch (err) {
        res.status(200).send({ success: false, error: err, message: 'An Error Catched' });
    }

}
exports.upload = (async(req,res) => {
    try{
      if(req.file){
        var filename = req.file.originalname
        res.status(200).send({message : 'PurchaseOrder Invoice Sucessfully', Path : `${req.file.destination.replace('./src/public/',appRouteModels.BASEURL)}/${filename}`})
      }
    }catch (err) {
        console.log(err)
      res.status(400).send(err);
    }
})