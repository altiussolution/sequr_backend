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

exports.getStockAllocations =   ((req,res) =>{
    var offset = req.query.offset != undefined ? parseInt(req.query.offset) : false;
    var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false;
    var searchString = req.query.searchString
    var query = (searchString ? {active_status: 1,status:1, $text: {$search: searchString}} : {active_status: 1, status:1})
    try{
        stockAllocationModel.find(query).populate("item").populate("compartment").populate("sub_category")
        .populate("supplier").populate("purchase_order").populate("bin").populate("category").populate("cube").skip(offset).limit(limit).then(stocks =>{
            res.status(200).send({ success: true, data: stocks });
        }).catch(error => {
            console.log(error)
            res.status(400).send({success: false, error : error.name})
        })
    } catch(error){
        console.log(error.name)
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

exports.getItemById = ((req,res) =>{
    try{
        var item = req.params.item;
        stockAllocationModel.findOne({item:item}).populate('item').populate('cube').populate('bin').populate('compartment').then(data =>{
            if(data){
                res.status(200).send({status:true, data})
            }else{
                res.status(200).send({status : false , message : 'No Data Found'});
            }
        })
    }catch(err){
        res.status(400).send({status : false , message : err.name});
    }
})

exports.getStockAllocationsfilter =   ((req,res) =>{

    var category_name = req.query.category_name;
    var sub_category_name= req.query.sub_category_name;
    var status = req.query.status;
    var supplier_name = req.query.supplier_name;
    var cube_name = req.query.cube_name;
    
    if (category_name && sub_category_name && status && supplier_name && cube_name){
        var query = {category_name:category_name,sub_category_name :sub_category_name , status  : status ,supplier_name:supplier_name, cube_name:cube_name}
    }
    else if(category_name && sub_category_name && supplier_name && cube_name){
        var query = {category_name: category_name, sub_category_name : sub_category_name ,supplier_name:supplier_name,cube_name:cube_name }
    }
    else if( category_name && status  && sub_category_name && cube_name){
        var query = { category_name: category_name ,  status : status ,sub_category_name : sub_category_name,cube_name:cube_name}
    }
    else if( sub_category_name  && status  && supplier_name && cube_name){
        var query = {sub_category_name  : sub_category_name  , status : status ,supplier_name :supplier_name,cube_name:cube_name}
    }
    else if( category_name  && status && supplier_name && cube_name ){
        var query = {category_name  : category_name  , status :status ,supplier_name :supplier_name,cube_name:cube_name}
    }
      else if( category_name  && status && supplier_name && sub_category_name ){
        var query = {category_name  : category_name  , status :status ,supplier_name :supplier_name,sub_category_name:sub_category_name}
    }
    else if( category_name && sub_category_name && cube_name){
        var query = {category_name:category_name , sub_category_name : sub_category_name,cube_name:cube_name}
    }                                                                                                     
    else if(category_name && supplier_name && cube_name){
        var query = { category_name :category_name ,supplier_name:supplier_name,cube_name : cube_name}
    }
    else if( category_name && status && cube_name){
        var query = { category_name :category_name , status:status,cube_name:cube_name}
    }
    
    else if( sub_category_name && supplier_name && cube_name){
        var query = {sub_category_name : sub_category_name, supplier_name:supplier_name,cube_name:cube_name}
    }
    else if( sub_category_name && status && cube_name ){
        var query = {sub_category_name : sub_category_name, status:status,cube_name:cube_name}
    }
    else if( status && supplier_name && cube_name){
        var query = { status :status,supplier_name:supplier_name,cube_name:cube_name  }
    }
    else if(category_name && supplier_name && sub_category_name){
        var query = { category_name :category_name ,supplier_name:supplier_name,sub_category_name:sub_category_name}
    }
    else if(category_name && status && sub_category_name){
        var query = { category_name :category_name , status: status,sub_category_name:sub_category_name}
    }
    else if(supplier_name && status && sub_category_name){
        var query = { supplier_name :supplier_name , status: status,sub_category_name:sub_category_name}
    }
    
    else if( category_name && sub_category_name){
        var query = {category_name:category_name , sub_category_name : sub_category_name}
    }                                                                                                     
    else if(category_name && supplier_name){
        var query = { category_name :category_name ,supplier_name:supplier_name}
    }
    else if( category_name && status){
        var query = { category_name :category_name , status:status}
    }
    else if( sub_category_name && supplier_name){
        var query = {sub_category_name : sub_category_name, supplier_name:supplier_name}
    }
    else if( sub_category_name && status ){
        var query = {sub_category_name : sub_category_name, status:status}
    }
    else if( status && supplier_name){
        var query = { status :status,supplier_name:supplier_name  }
    }
    else if( category_name && cube_name){
        var query = { category_name :category_name ,cube_name:cube_name  }
    }
    else if(  cube_name && supplier_name){
        var query = { cube_name :cube_name,supplier_name:supplier_name  }
    }
    else if( sub_category_name && cube_name){
        var query = {sub_category_name :sub_category_name ,cube_name:cube_name  }
    }
    else if( status && cube_name){
        var query = { status :status,cube_name:cube_name  }
    }
    else if( supplier_name ){
      var query = { supplier_name :supplier_name}
    }
    else if( category_name ){
      var query = { category_name :category_name}
    }
    else if( sub_category_name ){
      var query = { sub_category_name :sub_category_name}
    }
    else if( status  ){
      var query = {  status: status}
    }
    else if( cube_name  ){
    var query = {  cube_name: cube_name}
    }
    try{
        stockAllocationModel.find(query).populate("item").populate("compartment").populate("sub_category")
        .populate("supplier").populate("purchase_order").populate("bin").populate("category").populate("cube").then(stocks =>{
            res.status(200).send({ success: true, data: stocks });
        }).catch(error => {
            console.log(error)
            res.status(400).send({success: false, error : error.name})
        })
    } catch(error){
        console.log(error.name)
        res.status(201).send({success: false, error : error})
    }
    
    })
    