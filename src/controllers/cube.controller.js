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
    var offset = req.query.offset != undefined ? parseInt(req.query.offset) : false;
    var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false;
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

exports.getCubefilter = (req, res) => {
 
    var branch_name = req.query.branch_name;
    var cube_type = req.query.cube_type;
    var employee_status = req.query.employee_status;

    if (branch_name && cube_type && employee_status){
        var query = {branch_name :branch_name ,cube_type :cube_type ,employee_status  :employee_status}
    }
    else if(branch_name && cube_type ){
        var query = {branch_name : branch_name , cube_type : cube_type  }
    }
    else if( cube_type && employee_status  ){
        var query = {cube_type  : cube_type, employee_status : employee_status }
    }
    else if( branch_name  && employee_status  ){
        var query = {branch_name : branch_name, employee_status :employee_status}
    }
                                                                                                        
    else if(branch_name ){
        var query = { branch_name:branch_name}
    }

     else if( cube_type ){
        var query = {cube_type : cube_type}
    }
    else if( employee_status ){
        var query = {employee_status :employee_status  }
    }

try {
    cubeModel.find(query).populate("branch_id").then(cube => {
        res.status(200).send({ success: true, data: cube });
    }).catch(error => {
        res.status(400).send({ success: false, error: error })
    })
} catch (error) {
    res.status(201).send({ success: false, error: error })
}
}
