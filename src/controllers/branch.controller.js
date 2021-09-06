const { branchModel } = require("../models");



exports.createBranch = (req, res) => {
    var newBranch = new branchModel(req.body);
    // console.log(req.body);
    newBranch.save(function (err) {
        if (err) {
            res.status(200).send({
                success: false,
                message: 'error in adding branch'
            });
        }
        else {
            res.status(200).send({ success: true, message: 'Branch Added Successfully!' });
        }
    });
}

exports.getBranch = (req, res) => {
    branchModel.find({active_status: 0}).populate("state_id").populate("city_id").exec((err, branch) => {
        if (!err) {
            res.status(200).send({ success: true, data: branch });
        } else {
            res.status(200).send({ success: false, message: 'No Branch Found' });
        }
    });
}


exports.updateBranch = (req, res) => {
    console.log(req.params.id);
    branchModel.findByIdAndUpdate(req.params.id, req.body , function(err, branch){
        if (!err) {
            res.status(200).send({ success: true, message: 'Branch Updated Successfully!' });
        }
        else {
            res.status(200).send({ success: false, message: 'error in updationg branch' });
        }
    });
}

exports.deleteBranch = (req, res) => {
    branchModel.findByIdAndUpdate(req.params.id, {active_status: 1} , function(err, branch){
        if (!err) {
            res.status(200).send({ success: true, message: 'Branch Deleted Successfully!' });
        }
        else {
            res.status(200).send({ success: false, message: 'error in deleting branch' });
        }
    });
}