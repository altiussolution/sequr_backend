const { cubeModel } = require('../models')
var { error_code } = require('../utils/enum.utils')
const { createLog } = require('../middleware/crud.middleware')
var ObjectId = require('mongodb').ObjectID
const { ObjectID } = require('bson')

// exports.createCube = (req, res) => {
//   try {
//       var newCube = new cubeModel(req.body);
//       newCube.save(async(err) => {
//           if (!err) {
//             console.log(err)
//               res.status(200).send({ success: true, message: 'Cube Created Successfully!' });
//               createLog(req.headers['authorization'], 'Cube', 2)
//           }
//          else {
//               const name = await cubeModel.findOne(({cube_name :req.body.cube_name, active_status : 1})).exec()
//               const id = await cubeModel.findOne(({ cube_id: req.body.cube_id ,active_status : 1 })).exec()
//               if(name){
//                   console.log(name)
//               var errorMessage = (err.code == error_code.isDuplication ? 'Cube name already exists' : err)
//               res.status(409).send({
//                   success: false,
//                   message: errorMessage
//               });
//           } else if (id){
//               var errorMessage = (err.code == error_code.isDuplication ? 'Cube id already exists' : err)
//               res.status(409).send({
//                   success: false,
//                   message: errorMessage
//               });
//           }
//       }
//       })
//   } catch (error) {
//       res.status(201).send(error)
//   }
// }
exports.createCube = (req, res) => {
  // Change your function name
  try {
    var newCube = new cubeModel(req.body) // Change model name
    newCube.save((err, doc) => {
      // past model body
      if (!err) {
        res
          .status(200)
          .send({ success: true, message: 'Cube Created Successfully!' }) //Change your meassage
        createLog(req.headers['authorization'], 'Cube', 2) // Change Logs
      } else if (err) {
        if (err.code == 11000) {
          res
            .status(422)
            .send({
              success: false,
              message: tiltelCase(`${Object.keys(err.keyPattern)[0].replace(
                '_',
                ' '
              )} already exist`)
            }) // Paste your validation fields
        }
      }
    })
  } catch (error) {
    res.status(201).send(error)
  }
}
function tiltelCase (str) {
  const arr = str.split(' ')
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
  }
  const str2 = arr.join(' ')
  return str2

}

exports.getCube = (req, res) => {
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
    cubeModel
      .find(query)
      .populate('branch_id')
      .skip(offset)
      .limit(limit)
      .then(cube => {
        res.status(200).send({ success: true, data: cube })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.updateCube = (req, res) => {
  try {
    cubeModel
      .findByIdAndUpdate(req.params.id, req.body)
      .then(cube => {
        res
          .status(200)
          .send({ success: true, message: 'Cube Updated Successfully!' })
        createLog(req.headers['authorization'], 'Cube', 1)
      })
      .catch(err => {
        res
          .status(200)
          .send({
            success: false,
            message: `${Object.keys(err.keyPattern)[0].replace(
              '_',
              ' '
            )} already exist`.toLowerCase()
          }) // Paste your validation fields
      })
  } catch (err) {
    res
      .status(200)
      .send({ success: false, error: err, message: 'An Error Catched' })
  }
}

exports.getCubefilter = (req, res) => {
  var branch_name = req.query.branch_name
  var cube_type = req.query.cube_type
  var employee_status = req.query.employee_status
  var company_id = req.query.company_id
  var query = searchString
    ? {
        active_status: 1,
        company_id: company_id,
        $text: { $search: searchString }
      }
    : { active_status: 1, company_id: company_id }
  if (branch_name) query['branch_name'] = branch_name
  if (cube_type) query['cube_type'] = cube_type
  if (employee_status) query['employee_status'] = employee_status
  if (company_id) query['company_id'] = company_id
  try {
    cubeModel
      .find(query)
      .populate('branch_id')
      .then(cube => {
        res.status(200).send({ success: true, data: cube })
      })
      .catch(error => {
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
            from: 'stockallocations', // model name
            localField: '_id',
            foreignField: 'cube',
            as: 'stockAllocation_doc' // name of the document contains all cubes
          }
        },
        {
          $lookup: {
            from: 'compartments', // model name
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
          await message.push('Please delete all the refered bin by this cube')
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
