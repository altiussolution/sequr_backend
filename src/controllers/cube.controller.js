const { cubeModel } = require("../models");
var {error_code} = require('../utils/enum.utils')
const { createLog } = require('../middleware/crud.middleware')
var ObjectId = require('mongodb').ObjectID
const { ObjectID } = require('bson')


exports.createCube = (req, res) => {
    try {
        var newCube = new cubeModel(req.body);
        newCube.save((err) => {
            if (!err) {
                res.status(200).send({ success: true, message: 'Cube Created Successfully!' });
                createLog(req.headers['authorization'], 'Cube', 2)
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
            createLog(req.headers['authorization'], 'Cube', 1)
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

exports.deleteCube = (req, res) => {
    try {
      cubeModel //(paste your model)
        .aggregate([
          //Find cube id and active_status is 1
          {
            $match: {
              $and: [{ _id: ObjectId(req.params.id) }, { active_status: 1 }]
            }
          },
  
          //********************************** */
  
  
  
          // Get all refered documents
          // *** 1 ***
          {
            $lookup: {
              from: 'branch', // model name
              localField: '_id',
              foreignField: 'cube_id',
              as: 'branch_doc' // name of the document contains all users
            }
          },
          // *** 2 ***
          {
            $lookup: {
              from: 'bin', // model name
              localField: '_id',
              foreignField: 'cube_id',
              as: 'bin_doc' // name of the document contains all cubes
            }
          },
          {
            $lookup: {
              from: 'stockAllocation', // model name
              localField: '_id',
              foreignField: 'cube_id',
              as: 'stockAllocation_doc' // name of the document contains all cubes
            }
          },
          {
            $lookup: {
              from: 'compartment', // model name
              localField: '_id',
              foreignField: 'cube_id',
              as: 'compartment_doc' // name of the document contains all cubes
            }
          }
          //********************************** */
        ])
        .then(async doc => {
          //Push messages if there is any documents refered
          message = []
  
          //push message if there is any referenced document
          //********************************** */
  
  
          // *** 1 ***
          if (doc[0].branch_doc.length > 0) {
            await message.push(
              'Please delete all the refered branch by this cube'
            )
          }
          // *** 2 ***
          if (doc[0].bin_doc.length > 0) {
            await message.push(
              'Please delete all the refered bin by this cube'
            )
          }
          if (doc[0].stockAllocation_doc.length > 0) {
            await message.push(
              'Please delete all the refered stockAllocation by this cube'
            )
          }
          if (doc[0].compartment_doc.length > 0) {
            await message.push(
              'Please delete all the refered compartment by this cube'
            )
          }
          //********************************** */
  
  
  
          // Check if any referenced document with active_status 1 is present id DB
          if (message.length > 0) {
            res.status(200).send({ success: true, message: message })
  
            // Delet the document if there is no any referenced document
          } else if (message.length == 0) {
            cubeModel
              .deleteOne({ _id: ObjectId(req.params.id), active_status: 1 })
              .then(cube => {
                res.status(200).send({
                  success: true,
                  message: 'Cube Deleted Successfully!'
                })
                createLog(req.headers['authorization'], 'Cube', 0)
              })
              .catch(err => {
                res
                  .status(200)
                  .send({ success: false, message: 'Cube Not Found' })
              })
  
          
          }
        })
        .catch(err => {
          res.status(200).send({ success: false, message: 'Cube Not Found' })
        })
    } catch (err) {
      res
        .status(200)
        .send({ success: false, error: err, message: 'An Error Catched' })
    }
  }
  