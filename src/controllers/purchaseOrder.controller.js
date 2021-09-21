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
 
 exports.getPurchaseOrder = (req, res) => {
    var searchString = req.query.searchString;
    var query = (searchString ? { active_status: 1, $text: { $search: searchString } } : { active_status: 1 })
    try {
        purchaseOrderModel.find(query).populate('item_id').populate('sub_category_id').then(purchaseOrder => {
            res.status(200).send({ success: true, data: purchaseOrder })
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
}

exports.updatePurchaseOrder = (async (req, res) => {
    console.log(req.params.id)
    try{
        purchaseOrderModel.findByIdAndUpdate(req.params.id, req.body).then(purchaseOrderUpdate =>{
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
        purchaseOrderModel.findByIdAndUpdate(req.params.id, { active_status: 0 }).then(purchaseOrder => {
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