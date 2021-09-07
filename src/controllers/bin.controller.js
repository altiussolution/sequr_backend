const { binModel } = require("../models");

exports.createBin = ((req,res) =>{
    try{
        var bin = new binModel(req.body);
        bin.save((err)=>{
            if(!err){
                res.status(200).send({ success: true, message: 'Bin Created Successfully!' });
            }else{
                res.status(200).send({
                    success: false,
                    message: 'Bin Not Found'
                });
            }
        })
    }
    catch(error){
        res.status(201).send(error)
    }
})

exports.getBin = ((req,res) =>{
    try{
        binModel.find({active_status: 1}).populate("cube_id").exec((err, bin) => {
            if (!err) {
                res.status(200).send({ success: true, data: bin });
            } else {
                res.status(200).send({ success: false, message: 'Bin Not Found' });
            }
        });
    } catch(error){
        res.status(201).send(error)
    }
  
})

exports.updateBin = ((req,res) =>{
    binModel.findByIdAndUpdate(req.params.id, req.body , function(err, bin){
        if (!err) {
            res.status(200).send({ success: true, message: 'Bin Updated Successfully!' });
        }
        else {
            res.status(200).send({ success: false, message: 'Bin Not Found' });
        }
    });
})

exports.deleteBin = ((req,res) =>{
    binModel.findByIdAndUpdate(req.params.id, {active_status: 0} , function(err, branch){
        if (!err) {
            res.status(200).send({ success: true, message: 'Bin Deactivated Successfully!' });
        }
        else {
            res.status(200).send({ success: false, message: 'Bin Not Found' });
        }
    });
})