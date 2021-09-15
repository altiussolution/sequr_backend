const {stockAllocationModel} = require('../models')
exports.allocateStock = ((req,res) =>{
    try{
        var stock = new stockAllocationModel(req.body)
        stock.save((err)=>{
            if(!err){
                res.status(200).send({ success: true, message: 'Stock Allocated Successfully' });
            }else{
                res.status(201).send({status:false, message:err.name})
            }
        })
    }catch(err){
        res.status(201).send({status:false,message:err.name})
    }
    
})

exports.getStockAllocations = ((req,res) =>{
    var offset = req.query.offset != undefined ? parseInt(req.query.offset) : false;
    var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false;
    var searchString = req.query.searchString
    var query = (searchString ? {active_status: 1, $text: {$search: searchString}} : {active_status: 1})
    try{
        stockAllocationModel.find(query).populate("item").populate("compartment").skip(offset).limit(limit).then(stocks =>{
            res.status(200).send({ success: true, data: stocks });
        }).catch(error => {
            res.status(400).send({success: false, error : error})
        })
    } catch(error){
        res.status(201).send({success: false, error : error})
    }
  
})