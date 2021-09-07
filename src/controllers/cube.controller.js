const { cubeModel } = require("../models");



exports.createCube = (req, res) => {
    var newCube = new cubeModel(req.body);
    // console.log(req.body);
    newCube.save(function (err) {
        if (err) {
            res.status(200).send({
                success: false,
                message: 'error in adding Cube'
            });
        }
        else {
            res.status(200).send({ success: true, message: 'Cube Added Successfully!' });
        }
    });
}


exports.getCube = (req, res) => {
    cubeModel.find({active_status: 0}).populate("branch_id").exec((err, cube) => {
        if (!err) {
            res.status(200).send({ success: true, data: cube });
        } else {
            res.status(200).send({ success: false, message: 'No Cube Found' });
        }
    });
}

exports.updateCube = (req, res) => {
    console.log(req.params.id);
    cubeModel.findByIdAndUpdate(req.params.id, req.body , function(err, cube){
        if (!err) {
            res.status(200).send({ success: true, message: 'Cube Updated Successfully!' });
        }
        else {
            res.status(200).send({ success: false, message: 'error in updationg Cube' });
        }
    });
}
