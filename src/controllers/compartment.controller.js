const { compartmentModel } = require("../models");
var {error_code} = require('../utils/enum.utils')



exports.createCompartment = (req, res) => {
    try {
        var newCompartment = new compartmentModel(req.body);
        newCompartment.save((err) => {
            if (!err) {
                res.status(200).send({ success: true, message: 'Compartment Created Successfully!' });
            }
            else {
                var errorMessage = (err.code == error_code.isDuplication ? 'Duplication occured in Compartment code or name' : err)
                res.status(200).send({
                    success: false,
                    message: errorMessage
                });
            }
        });
    } catch (error) {
        res.status(201).send(error)
    }
}


exports.getCompartment = (req, res) => {
    var offset = parseInt(req.query.offset);
    var limit = parseInt(req.query.limit);
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
