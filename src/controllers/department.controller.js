const { departmentModel } = require('../models')
var { error_code } = require('../utils/enum.utils')
const { createLog } = require('../middleware/crud.middleware')
var ObjectId = require('mongodb').ObjectID
const { ObjectID } = require('bson')

exports.createDepartment = (req, res) => {
  try {
    var newDepartment = new departmentModel(req.body)
    newDepartment
      .save(async err => {
        if (!err) {
          res
            .status(200)
            .send({
              success: true,
              message: 'Department Created Successfully!'
            })
          createLog(req.headers['authorization'], 'Department', 2)
        } else {
          const name = await departmentModel
            .findOne({
              department_name: req.body.department_name,
              active_status: 1,
              company_id:req.body.company_id
            })
            .exec()
          const id = await departmentModel
            .findOne({
              department_id: req.body.department_id,
              active_status: 1,
              company_id:req.body.company_id
            })
            .exec()
          if (name) {
            console.log(name)
            var errorMessage =
              err.code == error_code.isDuplication
                ? 'Department name already exists'
                : err
            res.status(409).send({
              success: false,
              message: errorMessage
            })
          } else if (id) {
            var errorMessage =
              err.code == error_code.isDuplication
                ? 'Department id already exists'
                : err
            res.status(409).send({
              success: false,
              message: errorMessage
            })
          }
        }
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send(error)
  }
}

exports.getDepartment = (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
  var searchString = req.query.searchString
  var company_id = req.query.company_id
  var query = searchString
    ? {
        active_status: 1,
        $text: { $search: searchString },
        company_id: company_id
      }
    : { active_status: 1, company_id: company_id }
  try {
    departmentModel
      .find(query)
      .skip(offset)
      .limit(limit)
      .then(department => {
        console.log(department)
        res.status(200).send({ success: true, data: department })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.updateDepartment = (req, res) => {
  try {
    departmentModel
      .findByIdAndUpdate(req.params.id, req.body)
      .then(department => {
        res
          .status(200)
          .send({ success: true, message: 'Department Updated Successfully!' })
        createLog(req.headers['authorization'], 'Department', 1)
      })
      .catch(error => {
        res
          .status(200)
          .send({ success: false, error: error, message: 'An Error Occured' })
      })
  } catch (err) {
    res
      .status(200)
      .send({ success: false, error: err, message: 'An Error Catched' })
  }
}

// exports.deleteDepartment = (req,res) =>{
//     try{
//         departmentModel.findByIdAndUpdate(req.params.id, {active_status: 0}).then(department =>{
//             res.status(200).send({ success: true, message: 'Department Deleted Successfully!' });
//             createLog(req.headers['authorization'], 'Department', 0)
//         }).catch(err =>{
//             res.status(200).send({ success: false, message: 'Department Not Found' });
//         })
//     }
//     catch(err){
//         res.status(200).send({ success: false, error: err, message : 'An Error Catched' });
//     }

// }

exports.deleteDepartment = (req, res) => {
  try {
    departmentModel //(paste your model)
      .aggregate([
        //Find department id and active_status is 1
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
            from: 'users', // model name
            localField: '_id',
            foreignField: 'department_id',
            as: 'user_doc' // name of the document contains all users
          }
        }
        // *** 2 ***

        //********************************** */
      ])
      .then(async doc => {
        //Push messages if there is any documents refered
        message = []

        //push message if there is any referenced document
        //********************************** */

        // *** 1 ***
        if (doc[0].user_doc.length > 0) {
          await message.push(
            'Please delete all the refered users by this department'
          )
        }
        // *** 2 ***

        //********************************** */

        // Check if any referenced document with active_status 1 is present id DB
        if (message.length > 0) {
          res.status(200).send({ success: true, message: message })

          // Delet the document if there is no any referenced document
        } else if (message.length == 0) {
          departmentModel
            .deleteOne({ _id: ObjectId(req.params.id), active_status: 1 })
            .then(department => {
              res.status(200).send({
                success: true,
                message: 'Department Deleted Successfully!'
              })
              createLog(req.headers['authorization'], 'Department', 0)
            })
            .catch(err => {
              res
                .status(200)
                .send({ success: false, message: 'Department Not Found' })
            })
        }
      })
      .catch(err => {
        res
          .status(200)
          .send({ success: false, message: 'Department Not Found' })
      })
  } catch (err) {
    res
      .status(200)
      .send({ success: false, error: err, message: 'An Error Catched' })
  }
}
