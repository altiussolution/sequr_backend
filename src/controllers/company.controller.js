const { companyModel, rolesModel } = require('../models')
var { error_code } = require('../utils/enum.utils')
const { createLog } = require('../middleware/crud.middleware')
var ObjectId = require('mongodb').ObjectID
const { ObjectID } = require('bson')

// exports.createCompany = (req, res) => {
//   try {
//     var newCompany = new companyModel(req.body)
//     newCompany.save(err => {
//       if (!err) {
//         res
//           .status(200)
//           .send({ success: true, message: 'Company Created Successfully!' })
//       } else {
//         var errorMessage =
//           err.code == error_code.isDuplication
//             ? 'Duplication occured in Company name'
//             : err
//         res.status(200).send({
//           success: false,
//           message: errorMessage
//         })
//       }
//     })
//   } catch (error) {
//     res.status(201).send(error)
//   }
// }
exports.createCompany = (req, res) => {
  // Change your function name
  try {
    var newCompany = new companyModel(req.body) // Change model name
    newCompany.save((err, doc) => {
      // past model body
      if (!err) {
        res
          .status(200)
          .send({ success: true, message: 'Company Created Successfully!' }) //Change your meassage
        createLog(req.headers['authorization'], 'Company', 2) // Change Logs
      } else if (err) {
        if (err.code == 11000) {
          res
            .status(422)
            .send({
              success: false,
              message: (tiltelCase(`${Object.keys(err.keyPattern)[0].replace(
                '_',
                ' '
              )} already exist`)).replace('Compartment', 'Draw')
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
exports.getCompany = (req, res) => {
  var offset = parseInt(req.query.offset)
  var limit = parseInt(req.query.limit)
  var searchString = req.query.searchString

  var query = searchString
    ? {
        active_status: 1,
        $text: { $search: searchString },
        company_name: { $ne: 'Smart Tools' },
        created_by: { $exists: true }
      }
    : {
        active_status: 1,
        company_name: { $ne: 'Smart Tools' },
        created_by: { $exists: true }
      }
  try {
    companyModel
      .find(query)
      .populate('country_id')
      .populate('state_id')
      .populate('city_id')
      .skip(offset)
      .limit(limit)
      .then(company => {
        res.status(200).send({ success: true, data: company })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.updateCompany = (req, res) => {
  try {
    companyModel
      .findByIdAndUpdate(req.params.id, req.body)
      .then(company => {
        res
          .status(200)
          .send({ success: true, message: 'Company Updated Successfully!' })
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

exports.deleteCompany = (req, res) => {
  try {
    companyModel
      .findByIdAndUpdate(req.params.id, { active_status: 0 })
      .then(company => {
        res
          .status(200)
          .send({ success: true, message: 'Company Deleted Successfully!' })
      })
      .catch(err => {
        res.status(200).send({ success: false, message: 'Company Not Found' })
      })
  } catch (err) {
    res
      .status(200)
      .send({ success: false, error: err, message: 'An Error Catched' })
  }
}

exports.getRoles = (req, res) => {
  try {
    rolesModel.findOne(
      { active_status: 1, role_id: '$ SEQUR CUSTOMER $' },
      (err, roles) => {
        if (!err) {
          res.status(200).send({
            status: true,
            roles: roles
          })
        } else {
          res.send(err.message)
        }
      }
    )
  } catch (error) {
    res.send('An error occured')
    console.log(error)
  }
}
