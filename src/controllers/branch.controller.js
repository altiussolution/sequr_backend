const { branchModel } = require('../models')
var { error_code } = require('../utils/enum.utils')
const { createLog } = require('../middleware/crud.middleware')
var ObjectId = require('mongodb').ObjectID
const { ObjectID } = require('bson')

exports.createBranch = (req, res) => {
  try {
    var newBranch = new branchModel(req.body)
    newBranch.save(err => {
      if (!err) {
        res
          .status(200)
          .send({ success: true, message: 'Branch Created Successfully!' })
        createLog(req.headers['authorization'], 'Branch', 2)
      } else {
        var errorMessage =
          err.code == error_code.isDuplication
            ? 'Duplication occured in Branch name or code'
            : err
        res.status(200).send({
          success: false,
          message: errorMessage
        })
      }
    })
  } catch (error) {
    res.status(201).send(error)
  }
}

exports.getBranch = (req, res) => {
  var offset = parseInt(req.query.offset)
  var limit = parseInt(req.query.limit)
  var searchString = req.query.searchString
  var query = searchString
    ? { active_status: 1, $text: { $search: searchString } }
    : { active_status: 1 }
  try {
    branchModel
      .find(query)
      .populate('country_id')
      .populate('state_id')
      .populate('city_id')
      .skip(offset)
      .limit(limit)
      .then(branch => {
        res.status(200).send({ success: true, data: branch })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.updateBranch = (req, res) => {
  try {
    branchModel
      .findByIdAndUpdate(req.params.id, req.body)
      .then(branch => {
        res
          .status(200)
          .send({ success: true, message: 'Branch Updated Successfully!' })
        createLog(req.headers['authorization'], 'Branch', 1)
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

// exports.deleteBranch = (req, res) => {
//     try {
//         branchModel.findByIdAndUpdate(req.params.id, { active_status: 0 }).then(branch => {
//             res.status(200).send({ success: true, message: 'Branch Deleted Successfully!' });
//             createLog(req.headers['authorization'], 'Branch', 0)
//         }).catch(err => {
//             res.status(200).send({ success: false, message: 'Branch Not Found' });
//         })
//     }
//     catch (err) {
//         res.status(200).send({ success: false, error: err, message: 'An Error Catched' });
//     }

// }

exports.getBranchfilter = (req, res) => {
  var country_id = req.query.country_id
  var state_id = req.query.state_id
  var city_id = req.query.city_id

  if (country_id && state_id && city_id) {
    var query = { country_id: country_id, state_id: state_id, city_id: city_id }
  } else if (country_id && state_id) {
    var query = { country_id: country_id, state_id: state_id }
  } else if (state_id && city_id) {
    var query = { state_id: state_id, city_id: city_id }
  } else if (country_id && city_id) {
    var query = { country_id: country_id, city_id: city_id }
  } else if (country_id) {
    var query = { country_id: country_id }
  } else if (city_id) {
    var query = { city_id: city_id }
  } else if (state_id) {
    var query = { state_id: state_id }
  }
  try {
    branchModel
      .find(query)
      .populate('country_id')
      .populate('state_id')
      .populate('city_id')
      .then(branch => {
        res.status(200).send({ success: true, data: branch })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

// exports.createBranch = (async(req, res) => {
//     try {
//         var newBranch = new branchModel(req.body);
//         const {
//             branch_name,
//             branch_code,
//             branch_address,
//             email_id,
//             phone_number,
//             active_status
//         } = req.body
//         const name = await branchModel.findOne(({ branch_name , active_status: 1 }))
//        const id = await branchModel.findOne(({ branch_code ,  active_status: 1 }))
//         const oldaddress = await branchModel.findOne({branch_address  , active_status: 1 })
//         const oldemail = await branchModel.findOne({email_id, active_status: 1 })
//         const oldmobilenumber = await branchModel.findOne({phone_number, active_status:1 })
//         if (name){
//             return res
//             .status(409)
//             .send( {status: false, message: 'Branch name already exists'})
//           }
//           if (id){
//             return res
//             .status(409)
//             .send( {status: false, message: 'Branch id already exists'})
//           }
//           if (oldaddress){
//             return res
//             .status(409)
//             .send( {status: false, message: 'Branch address already exists'})
//           }
//           if (oldemail){
//             return res
//             .status(409)
//             .send( {status: false, message: 'Email already exists'})
//           }
//           if (oldmobilenumber){
//             return res
//             .status(409)
//             .send( {status: false, message: 'Mobile Number already exists'})
//           }
//           if(!name && !id && !oldaddress && !oldemail && !oldmobilenumber){
//             newBranch.save(async(err) => {
//                 if (!err) {
//                     res.status(200).send({ success: true, message: 'Branch Created Successfully!' });
//                     createLog(req.headers['authorization'], 'Branch', 2)
//                 }
//             //    else {
//             //     const name = await branchModel.findOne(({ branch_name , active_status: 1 })).exec()
//             //     const id = await branchModel.findOne(({ branch_code ,  active_status: 1 })).exec()
//             //         if(name){
//             //             var errorMessage = (err.code == error_code.isDuplication ? `Branch name already exists` : err)
//             //             console.log(err)
//             //             res.status(200).send({
//             //                 success: false,
//             //                 message: errorMessage
//             //             });
//             //         }else if(id){
//             //             var errorMessage = (err.code == error_code.isDuplication ? `Branch code already exists` : err)
//             //             console.log(err)
//             //             res.status(200).send({
//             //                 success: false,
//             //                 message: errorMessage
//             //             });
//             //         }

//             //     }
//             });
//           }

//     } catch (err) {
//         // res.status(201).send(err)
//         console.log(err)
//     }
// })

exports.deleteBranch = (req, res) => {
  try {
    branchModel //(paste your model)
      .aggregate([
        //Find branch id and active_status is 1
        {
          $match: {
            $and: [{ _id: ObjectId(req.params.id) }, { active_status: 1 }]
          }
        },

        // *** 1 ***
        // Get refered users with filter active status 1
        {
          $lookup: {
            from: 'users', // model name
            localField: '_id',
            foreignField: 'branch_id',
            as: 'user_doc' // name of the document contains all users
          }
        },
        // *** 2 ***
        // Get refered cubes with filter active status 1
        {
          $lookup: {
            from: 'cubes', // model name
            localField: '_id',
            foreignField: 'branch_id',
            as: 'cube_doc' // name of the document contains all cubes
          }
        }
      ])
      .then(async docs => {
        //Pull messages if there is any documents refered
        message = []

        //push message if there is any referenced document
        for await (let doc of docs) {
          // *** 1 ***
          if (doc.user_doc.length > 0) {
            message.push('Please delete all the refered users by this branch')
          }
          // *** 2 ***
          if (doc.cube_doc.length > 0) {
            message.push('Please delete all the refered cubes by this branch')
          }
        }

        // Check if any referenced document with active_status 1 is present id DB
        if (message.length > 0) {
          res.status(200).send({ success: true, message: message })

          // Delet the document if there is no any referenced document
        } else if (message.length == 0) {
          branchModel
            .remove({ _id: ObjectId(req.params.id), active_status: 0 })
            .then(branch => {
              res.status(200).send({
                success: true,
                message: 'Branch Deleted Successfully!'
              })
              createLog(req.headers['authorization'], 'Branch', 0)
            })
            .catch(err => {
              res
                .status(200)
                .send({ success: false, message: 'Branch Not Found' })
            })

          res
            .status(200)
            .send({ success: true, message: 'Branch Deleted Successfully!' })
        }
      })
      .catch(err => {
        res.status(200).send({ success: false, message: 'Branch Not Found' })
      })
  } catch (err) {
    res
      .status(200)
      .send({ success: false, error: err, message: 'An Error Catched' })
  }
}
