const { departmentModel } = require("../models");



exports.createDepartment = (req, res) => {
    var newDepartment = new departmentModel(req.body);
    // console.log(req.body);
    newDepartment.save(function (err) {
        if (err) {
            res.status(200).send({
                success: false,
                message: 'error in adding department'
            });
        }
        else {
            res.status(200).send({ success: true, message: 'Department Added Successfully!' });
        }
    });
}


exports.getDepartment = (req, res) => {
    departmentModel.find({active_status: 0}).exec((err, department) => {
        if (!err) {
            res.status(200).send({ success: true, data: department });
        } else {
            res.status(200).send({ success: false, message: 'No Department Found' });
        }
    });
}

exports.updateDepartment = (req, res) => {
    console.log(req.params.id);
    departmentModel.findByIdAndUpdate(req.params.id, req.body , function(err, department){
        if (!err) {
            res.status(200).send({ success: true, message: 'Department Updated Successfully!' });
        }
        else {
            res.status(200).send({ success: false, message: 'error in updationg department' });
        }
    });
}

exports.deleteDepartment = (req, res) => {
    departmentModel.findByIdAndUpdate(req.params.id, {active_status: 1} , function(err, department){
        if (!err) {
            res.status(200).send({ success: true, message: 'Department Deleted Successfully!' });
        }
        else {
            res.status(200).send({ success: false, message: 'error in deleting department' });
        }
    });
}