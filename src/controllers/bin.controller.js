const { binModel, cubeModel } = require("../models");
var {error_code} = require('../utils/enum.utils')


exports.createBin = (async (req,res) =>{  
    try{
        var body = req.body;
        var bin = new binModel(body);
        var isBinExist = await binModel.find({ $or: [{bin_name : body.bin_name},{bin_id: body.bin_id} ] }).exec()
        var checkBinCount = await cubeModel.findById(body.cube_id,['bin_max','bin_min']).exec()
        if(checkBinCount.bin_max < body.item_max_cap){
            res.status(200).send({ success: false, message: `Maximum bin count is ${checkBinCount.bin_max}` });
        }else if(checkBinCount.bin_min < body.item_min_cap){
            res.status(200).send({ success: false, message: `Minimum bin count is ${checkBinCount.bin_min}` });
        }
        else if(isBinExist.length == 0){
            bin.save((err)=>{
                if(!err){
                    res.status(200).send({ success: true, message: 'Bin Created Successfully!' });
                }else{
                    res.status(201).send({
                        success: false,
                        message: err
                    });
                }
            })
        }else{
            res.status(200).send({
                success: false,
                message: 'Bin already exist'
            });
        }
       
    }
    catch(error){
        res.status(201).send(error.name)
    }
})  

exports.getBin = ((req,res) =>{
    var offset = req.query.offset != undefined ? parseInt(req.query.offset) : false;
    var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false;
    var searchString = req.query.searchString
    var query = (searchString ? {active_status: 1, $text: {$search: searchString}} : {active_status: 1})
    try{
        binModel.find(query).populate("cube_id").skip(offset).limit(limit).then(bins =>{
            res.status(200).send({ success: true, data: bins });
        }).catch(error => {
            res.status(400).send({success: false, error : error})
        })
    } catch(error){
        res.status(201).send({success: false, error : error})
    }
  
})

exports.getBinByCube = ((req,res) =>{
    try{
        var cube_id = req.query.cube_id;
        if(cube_id){
            binModel.find({cube_id:cube_id}).then(bins =>{
                res.status(200).send({ success: true, data: bins });
            }).catch(err=>{
                res.status(201).send({success: false, message : err})
            })
        }else{
            res.status(201).send({success: false, message : 'Cube Id Required'})
        }
    }catch(error){
        res.status(201).send({success: false, message : error.name})
    }
   
}) 
  
exports.updateBin = (async (req,res) =>{
    try{
        binModel.findByIdAndUpdate(req.params.id, req.body).then(binUpdate =>{
            res.status(200).send({ success: true, message: 'Bin Updated Successfully!' });
        }).catch(error =>{
            res.status(200).send({ success: false, error: error, message : 'An Error Occured' });
        }) 
      
    }catch(err){
        res.status(200).send({ success: false, error: err, message : 'An Error Catched' });  
    }
   
})

exports.deleteBin = ((req,res) =>{
    try{
        binModel.findByIdAndUpdate(req.params.id, {active_status: 0}).then(binDelete =>{
            res.status(200).send({ success: true, message: 'Bin Deactivated Successfully!' });
        }).catch(err =>{
            res.status(200).send({ success: false, message: 'Bin Not Found' });
        })
    }
    catch(err){
        res.status(200).send({ success: false, error: err.name, message : 'An Error Catched' });  
    }
   
})