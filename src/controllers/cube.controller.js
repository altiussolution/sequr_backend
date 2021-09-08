const { cubeModel } = require("../models");
var {error_code} = require('../utils/enum.utils')



exports.createCube = (req, res) => {
    try {
        var newCube = new cubeModel(req.body);
        newCube.save((err) => {
            if (!err) {
                res.status(200).send({ success: true, message: 'Cube Created Successfully!' });
            }
            else {
                var errorMessage = (err.code == error_code.isDuplication ? 'Duplication occured in Cube code or name' : err)
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


exports.getCube = (req, res) => {
    var offset = parseInt(req.query.offset);
    var limit = parseInt(req.query.limit);
    var searchString = req.query.searchString;
    var query = (searchString ? { active_status: 1, $text: { $search: searchString } } : { active_status: 1 })
    try {
        cubeModel.find(query).populate("branch_id").skip(offset).limit(limit).then(cube => {
            res.status(200).send({ success: true, data: cube });
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
}

exports.updateCube = (req, res) => {
    try {
        cubeModel.findByIdAndUpdate(req.params.id, req.body).then(cube => {
            res.status(200).send({ success: true, message: 'Cube Updated Successfully!' });
        }).catch(error => {
            res.status(200).send({ success: false, error: error, message: 'An Error Occured' });
        })
    } catch (err) {
        res.status(200).send({ success: false, error: err, message: 'An Error Catched' });
    }
}
