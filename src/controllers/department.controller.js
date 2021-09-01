const { departmentModel } = require("../models");



exports.createDepartment = (req, res) => {
    var newDepartment = new departmentModel(req.body);
    console.log(req.body);
    newDepartment.save(function (err) {
        if (err) {
            return res.status(200).send({
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
    departmentModel.find().exec((err, department) => {
        if (!err) {
            res.status(200).send({ success: true, data: department });
        } else {
            res.status(200).send({ success: false, message: 'No Department Found' });
        }
    });
}