const { companyModel, rolesModel } = require('../models')
var { error_code } = require('../utils/enum.utils')

exports.createCompany = (req, res) => {
  try {
    var newCompany = new companyModel(req.body)
    newCompany.save(err => {
      if (!err) {
        res
          .status(200)
          .send({ success: true, message: 'Company Created Successfully!' })
      } else {
        var errorMessage =
          err.code == error_code.isDuplication
            ? 'Duplication occured in Company name'
            : err
        res.status(200).send({
          success: false,
          message: errorMessage
        })
      }
    })
    .catch(error => {
      res.status(400).send({ success: false, error: error })
    })
  } catch (error) {
    res.status(201).send(error)
  }
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
