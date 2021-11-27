const { branchModel } = require('../models')
var { error_code } = require('../utils/enum.utils')
const { createLog } = require('../middleware/crud.middleware')
var ObjectId = require('mongodb').ObjectID
const { ObjectID } = require('bson')

// exports.createBranch = (req, res) => {
//   try {
//     var newBranch = new branchModel(req.body)
//     newBranch.save(err => {
//       if (!err) {
//         res
//           .status(200)
//           .send({ success: true, message: 'Branch Created Successfully!' })
//         createLog(req.headers['authorization'], 'Branch', 2)
//       } else {
//        if (err.keyValue.branch_name){
//         var errorMessage =
//           err.code == error_code.isDuplication
//             ? 'Branch Name is already exist'
//             : err
//        } else if(err.keyValue.branch_code){
//         var errorMessage =
//         err.code == error_code.isDuplication
//           ? 'Branch Code is already exist'
//           : err
//        }
//        else if(err.keyValue.branch_address){
//         var errorMessage =
//         err.code == error_code.isDuplication
//           ? 'Address is already exist'
//           : err
//        }
//        else if(err.keyValue.phone_number){
//         var errorMessage =
//         err.code == error_code.isDuplication
//           ? 'Phonenumber  is already exist'
//           : err
//        }
//        else if(err.keyValue.email_id){
//         var errorMessage =
//         err.code == error_code.isDuplication
//           ? 'Email Id is already exist'
//           : err
//        }
//         res.status(409).send({
//           success: false,
//           message: errorMessage

//         })
//       }
//     })
//   } catch (error) {
//     res.status(201).send(error)
//   }
// }
exports.createBranch = async (req, res) => {
  try {
    var body = req.body
    var branch = new branchModel(req.body)
    const {
      branch_name,
      branch_code,
      branch_address,
      phone_number,
      email_id
    } = req.body
    const oldUser = await branchModel.findOne({
      branch_name,
      company_id: req.body.company_id
    })
    const code = await branchModel.findOne({
      branch_code,
      company_id: req.body.company_id
    })
    const address = await branchModel.findOne({
      branch_address,
      company_id: req.body.company_id
    })
    const email = await branchModel.findOne({
      email_id,
      company_id: req.body.company_id
    })
    const phone = await branchModel.findOne({
      phone_number,
      company_id: req.body.company_id
    })

    if (oldUser) {
      return res
        .status(409)
        .send({ status: false, message: 'Branch name already exists' })
    }
    if (code) {
      return res
        .status(409)
        .send({ status: false, message: 'Branch code already exists' })
    }
    if (address) {
      return res
        .status(409)
        .send({ status: false, message: 'Branch address  already exists' })
    }
    if (email) {
      return res
        .status(409)
        .send({ status: false, message: 'Email  already exists' })
    }
    if (phone) {
      return res
        .status(409)
        .send({ status: false, message: 'Phone Number  already exists' })
    }
    supplier.save(err => {
      if (!err) {
        res
          .status(200)
          .send({ success: true, message: 'Branch Created Successfully!' })
      }
    })
  } catch (err) {
    console.log(err)
  }
}


exports.getBranch = (req, res) => {
  var offset = req.query.offset != undefined ? parseInt(req.query.offset) : false;
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false;
  var searchString = req.query.searchString
  var company_id = req.query.company_id
  var query = searchString
    ? { active_status: 1, $text: { $search: searchString } }
    : { active_status: 1 , company_id : company_id}
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
  }
   catch (error) {
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
  query['company_id'] =  req.query.company_id
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

        //********************************** */

        // Get all refered documents
        // *** 1 ***
      
        // *** 2 ***
        {
          $lookup: {
            from: 'cubes', // model name
            localField: '_id',
            foreignField: 'branch_id',
            as: 'cube_doc' // name of the document contains all cubes
          }
        },
        {
          $lookup: {
            from: 'users', // model name
            localField: '_id',
            foreignField: 'branch_id',
            as: 'user_doc' // name of the document contains all users
          }
        },

        //********************************** */
      ])
      .then(async doc => {
        //Push messages if there is any documents refered
        message = []

        //push message if there is any referenced document
        //********************************** */

        // *** 1 ***
      
        // *** 2 ***
        if (doc[0].cube_doc.length > 0) {
          await message(
            'Please delete all the refered cubes by this branch'
          )
        }
        if (doc[0].user_doc.length > 0) {
          await message.push(
            'Please delete all the refered users by this branch'
          )
        }
        //********************************** */

        // Check if any referenced document with active_status 1 is present id DB
        if (message.length > 0) {
          res.status(200).send({ success: true, message: message })

          // Delet the document if there is no any referenced document
        } else if (message.length == 0) {
          branchModel
            .deleteOne({ _id: ObjectId(req.params.id), active_status: 1 })
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
