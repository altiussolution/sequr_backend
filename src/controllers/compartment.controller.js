const { compartmentModel } = require("../models");
var {error_code} = require('../utils/enum.utils')



exports.createCompartment = async (req, res) => {
    try {
        var isCompartmentExist = await compartmentModel.find({ $or: [{compartment_name : req.body.compartment_name},{compartment_id: req.body.compartment_id} ] , bin_id : req.body.bin_id }).exec()
        console.log(isCompartmentExist);
        if(isCompartmentExist.length == 0){
            var newCompartment = new compartmentModel(req.body);
            newCompartment.save((err) => {
                if (!err) {
                    res.status(200).send({ success: true, message: 'Compartment Created Successfully!' });
                }
                else {
                    console.log(err);
                    var errorMessage = (err.code == error_code.isDuplication ? 'Duplication occured in Compartment code or name' : err)
                    res.status(200).send({
                        success: false,
                        message: errorMessage
                    });
                }
            });
        }else{
            res.status(200).send({
                success: false,
                message: 'Compartment already exist'
            });
        }
       
    } catch (error) {
        console.log(error);
        res.status(201).send(error)
    }
}


exports.getCompartment = (req, res) => {
    var offset = req.query.offset != undefined ? parseInt(req.query.offset) : false;
    var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false;
    var searchString = req.query.searchString;
    var query = (searchString ? { active_status: 1, $text: { $search: searchString } } : { active_status: 1 })
    try {
        compartmentModel.find(query).populate("cube_id").populate("bin_id").skip(offset).limit(limit).then(compartment => {
            console.log(compartment)
            res.status(200).send({ success: true, data: compartment });
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
}

exports.getCompartmentByCube = (req,res) =>{
    try{
        var cube_id = req.query.cube_id;
        var bin_id = req.query.bin_id;
        if(cube_id && bin_id){
            compartmentModel.find({cube_id:cube_id,bin_id:bin_id}).then(compartments =>{
                res.status(200).send({ success: true, data: compartments });
            }).catch(err=>{
                res.status(201).send({success: false, message : err})
            })
        }else{
            res.status(201).send({success: false, message : 'Cube Id and Bin IDRequired'})
        }
    }catch(error){
        res.status(201).send({success: false, message : error.name})
    }
}

exports.updateCompartment = (req, res) => {
    try {
        compartmentModel.findByIdAndUpdate(req.params.id, req.body).then(compartment => {
            res.status(200).send({ success: true, message: 'Compartment Updated Successfully!' });
        }).catch(error => {
            res.status(200).send({ success: false, error: error, message: 'An Error Occured' });
        })
    } catch (err) {
        res.status(200).send({ success: false, error: err, message: 'An Error Catched' });
    }
}
