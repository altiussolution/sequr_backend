const { binModel } = require("../models");
var {error_code} = require('../utils/enum.utils')

exports.createBin = ((req,res) =>{
    try{
        var bin = new binModel(req.body);
        bin.save((err)=>{
            if(!err){
                res.status(200).send({ success: true, message: 'Bin Created Successfully!' });
            }else{
                var errorMessage = (err.code == error_code.isDuplication ? 'Duplication occured in Bin code or name' : err)
                res.status(200).send({
                    success: false,
                    message: errorMessage
                });
            }
        })
    }
    catch(error){
        res.status(201).send(error)
    }
})  

exports.getBin = ((req,res) =>{
    var offset = parseInt(req.query.offset);
    var limit = parseInt(req.query.limit);
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
  
exports.updateBin = ((req,res) =>{
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
        res.status(200).send({ success: false, error: err, message : 'An Error Catched' });  
    }
   
})