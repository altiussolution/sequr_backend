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
    var query = (searchString ? {active_status: 1,status:1, $text: {$search: searchString}} : {active_status: 1, status:1})
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

exports.updateStockAllocation = ((req,res) =>{
    var stockId = req.params.id;
    try{
        if(stockId){
            stockAllocationModel.findByIdAndUpdate(stockId, req.body).then(stockUpdate =>{
                if(stockUpdate){
                    res.status(200).send({ success: true, message: 'Stock Updated Successfully!' });
                }else{
                    res.status(200).send({ success: false, message: 'No Record found for given id' });
                }
            }).catch(error =>{
                res.status(201).send({ success: false, error: error, message : 'An Error Occured' });
            }) 
        }else{
            res.status(201).send({ success: false, message : 'An Error Occured stock id required' });
        }
       
    }catch(err){
        res.status(201).send({ success: false, error: err.name, message : 'An Error Catched' });  
    }
})

exports.deleteStockAllocation = ((req,res) =>{
    var stockId = req.params.id;
    try{
        if(stockId){
            stockAllocationModel.findByIdAndUpdate(stockId, {status:0}).then(stockDelete =>{
                if(stockDelete){
                    res.status(200).send({ success: true, message: 'Stock Deactivated Successfully!' });
                }else{
                    res.status(200).send({ success: false, message: 'No Record found for given id' });
                }
                
            }).catch(error =>{
                res.status(201).send({ success: false, error: error, message : 'An Error Occured' });
            }) 
        }else{
            res.status(201).send({ success: false, message : 'An Error Occured stock id required' });
        }
       
    }catch(err){
        res.status(201).send({ success: false, error: err.name, message : 'An Error Catched' });  
    }
})