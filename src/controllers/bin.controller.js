const { binModel, cubeModel } = require('../models')
var { error_code } = require('../utils/enum.utils')
const { createLog } = require('../middleware/crud.middleware')
var ObjectId = require('mongodb').ObjectID
const { ObjectID } = require('bson')
// exports.createBin = async (req, res) => {
//   try {
//     var body = req.body
//     var bin = new binModel(body)
//     var isBinExist = await binModel
//       .find({ $or: [{ bin_name: body.bin_name }, { bin_id: body.bin_id }] })
//       .exec()
//     var checkBinCount = await cubeModel
//       .findById(body.cube_id, ['bin_max', 'bin_min'])
//       .exec()
//     if (checkBinCount.bin_max < body.item_max_cap) {
//       res
//         .status(200)
//         .send({
//           success: false,
//           message: `Maximum bin count is ${checkBinCount.bin_max}`
//         })
//     } else if (checkBinCount.bin_min < body.item_min_cap) {
//       res
//         .status(200)
//         .send({
//           success: false,
//           message: `Minimum bin count is ${checkBinCount.bin_min}`
//         })
//     } else if (isBinExist.length == 0) {
//       bin.save(err => {
//         if (!err) {
//           res
//             .status(200)
//             .send({ success: true, message: 'Bin Created Successfully!' })
//           createLog(req.headers['authorization'], 'Columns', 2)
//         } else if(err){
//           if (err.keyValue.bin_name){
//             var errorMessage =
//               err.code == error_code.isDuplication
//                 ? 'Bin Name is already exist'
//                 : err
//            } else if(err.keyValue.bin_id){
//             var errorMessage =
//             err.code == error_code.isDuplication
//               ? 'Bin Id is already exist'
//               : err
//            }
//            res
//             .status(409)
//             .send({ success: false, message: errorMessage })
//         }
//       })
//     } 
//    }catch (error) {
//     res.status(201).send(error.name)
//   }
// }
exports.createBin = (req, res) => { // Change your function name
  var newBin = new binModel(req.body) // Change model name 
  newBin.save((err, doc) => { // past model body
    if (!err) {
      res
        .status(200)
        .send({ success: true, message: 'Bin Created Successfully!' }) //Change your meassage
      createLog(req.headers['authorization'], 'Bin', 2) // Change Logs
    } else if (err) {
      if (err.code == 11000) {
        res
          .status(422)
          .send({ success: false, message: (`${((Object.keys(err.keyPattern)[0]).replace('_', ' '))} already exist`).toUpperCase() }) // Paste your validation fields 
      }
    }
  })
}

exports.getBin = (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
  var searchString = req.query.searchString
  var cube_id = req.query.cube_id
  var company_id = req.query.company_id
  var is_removed = req.query.is_removed
  var query = searchString
    ? { active_status: 1, $text: { $search: searchString } }
    : { active_status: 1 , company_id : company_id} 
    if (cube_id) query['cube_id'] = cube_id
    if (is_removed) query['is_removed'] = is_removed
  try {
    binModel
      .find(query)
      .populate('cube_id')
      .skip(offset)
      .limit(limit)
      .then(bins => {
        res.status(200).send({ success: true, data: bins })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.getBinByCube = (req, res) => {
  try {
    var company_id = req.query.company_id
    var cube_id = req.query.cube_id
    if (cube_id && company_id) {
      binModel
        .find({ cube_id: cube_id ,company_id:company_id})
        .then(bins => {
          res.status(200).send({ success: true, data: bins })
        })
        .catch(err => {
          res.status(201).send({ success: false, message: err })
        })
    } else {
      res.status(201).send({ success: false, message: 'Cube Id Required' })
    }
  } catch (error) {
    res.status(201).send({ success: false, message: error.name })
  }
}

exports.updateBin = async (req, res) => {
  try {
    binModel
      .findByIdAndUpdate(req.params.id, req.body)
      .then(binUpdate => {
        res
          .status(200)
          .send({ success: true, message: 'Bin Updated Successfully!' })
          createLog(req.headers['authorization'], 'Columns', 1)
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

exports.deleteBin = (req, res) => {
  // try {
  //   binModel
  //     .findByIdAndUpdate(req.params.id, { active_status: 0 })
  //     .then(binDelete => {
  //       res
  //         .status(200)
  //         .send({ success: true, message: 'Bin Deactivated Successfully!' })
  //         createLog(req.headers['authorization'], 'Columns', 0)
  //     })
  //     .catch(err => {
  //       res.status(200).send({ success: false, message: 'Bin Not Found' })
  //     })
  // } catch (err) {
  //   res
  //     .status(200)
  //     .send({ success: false, error: err.name, message: 'An Error Catched' })
  // }
  try {
    binModel 
      .aggregate([
        {
          $match: {
            $and: [{ _id: ObjectId(req.params.id) }, { active_status: 1 }]
          }
        },
        {
          $lookup: {
            from: 'compartments',
            localField: '_id',
            foreignField: 'bin_id',
            as: 'compartment_doc'
          }
        },
        {
          $lookup: {
            from: 'stockallocations', 
            localField: '_id',
            foreignField: 'bin',
            as: 'stock_doc' 
          }
        },
      ]).then(async doc => {
        message = []
        if (doc[0].compartment_doc.length > 0) {
          await message.push(
            'Please delete all the refered compartments by this bin'
          )
        }
        if (doc[0].stock_doc.length > 0) {
          await message.push(
            'Please delete all the refered stocks by this bin'
          )
        }
        if (message.length > 0) {
          res.status(200).send({ success: true, message: message })

        
        } else if (message.length == 0) {
          binModel
            .deleteOne({ _id: ObjectId(req.params.id), active_status: 1 })
            .then(branch => {
              res.status(200).send({
                success: true,
                message: 'Bin Deleted Successfully!'
              })
              createLog(req.headers['authorization'], 'Columns', 0)
            })
            .catch(err => {
              res
                .status(200)
                .send({ success: false, message: 'Bin Not Found' })
            })
          }
      })
      .catch(err => {
        res.status(200).send({ success: false, message: 'Bin Not Found' })
      })
}catch (err) {
  res
    .status(200)
    .send({ success: false, error: err, message: 'An Error Catched' })
}
}
