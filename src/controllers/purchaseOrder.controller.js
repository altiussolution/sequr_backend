const { purchaseOrderModel } = require("../models");

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