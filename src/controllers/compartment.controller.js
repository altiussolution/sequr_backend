const { compartmentModel } = require("../models");



exports.createCompartment = (req, res) => {
    var newCompartment = new compartmentModel(req.body);
    // console.log(req.body);
    newCompartment.save(function (err) {
        if (err) {
            res.status(200).send({
                success: false,
                message: 'error in adding Compartment'
            });
        }
        else {
            res.status(200).send({ success: true, message: 'Compartment Added Successfully!' });
        }
    });
}


exports.getCompartment = (req, res) => {
    compartmentModel.find({active_status: 0}).populate("branch_id").exec((err, compartment) => {
        if (!err) {
            res.status(200).send({ success: true, data: Compartment });
        } else {
            res.status(200).send({ success: false, message: 'No Compartment Found' });
        }
    });
}

exports.updateCompartment = (req, res) => {
    console.log(req.params.id);
    compartmentModel.findByIdAndUpdate(req.params.id, req.body , function(err, compartment){
        if (!err) {
            res.status(200).send({ success: true, message: 'Compartment Updated Successfully!' });
        }
        else {
            res.status(200).send({ success: false, message: 'error in updationg Compartment' });
        }
    });
}
