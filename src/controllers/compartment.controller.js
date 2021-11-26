const { compartmentModel } = require('../models')
var { error_code } = require('../utils/enum.utils')
const { createLog } = require('../middleware/crud.middleware')
var ObjectId = require('mongodb').ObjectID
const { ObjectID } = require('bson')

exports.createCompartment = (req, res) => {
  try {
    var newCompartment = new compartmentModel(req.body)
    newCompartment
      .save(async err => {
        if (!err) {
          res
            .status(200)
            .send({
              success: true,
              message: 'Compartment Created Successfully!'
            })
          createLog(req.headers['authorization'], 'Compartment', 2)
        } else {
          const name = await compartmentModel
            .findOne({
              compartment_name: req.body.compartment_name,
              active_status: 1,
              company_id:req.body.company_id
            })
            .exec()
          const id = await compartmentModel
            .findOne({
              compartment_id: req.body.compartment_id,
              active_status: 1,
              company_id:req.body.company_id
            })
            .exec()
          if (name) {
            var errorMessage =
              err.code == error_code.isDuplication
                ? 'Compartment name already exists'
                : err
            res.status(409).send({
              success: false,
              message: errorMessage
            })
          } else if (id) {
            var errorMessage =
              err.code == error_code.isDuplication
                ? 'Compartment id already exists'
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

exports.getCompartment = (req, res) => {
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
    compartmentModel
      .find(query)
      .populate('cube_id')
      .populate('bin_id')
      .skip(offset)
      .limit(limit)
      .then(compartment => {
        console.log(compartment)
        res.status(200).send({ success: true, data: compartment })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.getCompartmentByCube = (req, res) => {
  try {
    var cube_id = req.query.cube_id
    var bin_id = req.query.bin_id
    var company_id = req.query.company_id
    if (cube_id && bin_id && company_id) {
      compartmentModel
        .find({ cube_id: cube_id, bin_id: bin_id, company_id: company_id })
        .then(compartments => {
          res.status(200).send({ success: true, data: compartments })
        })
        .catch(err => {
          res.status(201).send({ success: false, message: err })
        })
    } else {
      res
        .status(201)
        .send({ success: false, message: 'Cube Id and Bin IDRequired' })
    }
  } catch (error) {
    res.status(201).send({ success: false, message: error.name })
  }
}

exports.updateCompartment = (req, res) => {
  try {
    compartmentModel
      .findByIdAndUpdate(req.params.id, req.body)
      .then(compartment => {
        res
          .status(200)
          .send({ success: true, message: 'Compartment Updated Successfully!' })
        createLog(req.headers['authorization'], 'Compartment', 1)
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

exports.getCompartmentfilter = (req, res) => {
  var cube_type = req.query.cube_type
  var bin_id = req.query.bin_id
  var is_removed = req.query.is_removed
  var searchString = req.query.searchString
  var company_id = req.query.company_id
  var query = searchString
    ? {
        active_status: 1,
        $text: { $search: searchString },
        company_id: company_id
      }
    : { active_status: 1, company_id: company_id }
  if (bin_id) query['bin_id'] = bin_id
  if (cube_type) query['cube_type'] = cube_type
  if (is_removed) query['is_removed'] = is_removed
  if (company_id) query['company_id'] = company_id

  try {
    compartmentModel
      .find(query)
      .populate('cube_id')
      .populate('bin_id')
      .then(compartment => {
        console.log(compartment)
        res.status(200).send({ success: true, data: compartment })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.deleteCompartment = (req, res) => {
  try {
    compartmentModel
      .aggregate([
        {
          $match: {
            $and: [{ _id: ObjectId(req.params.id) }, { active_status: 1 }]
          }
        },
        {
          $lookup: {
            from: 'stockallocations',
            localField: '_id',
            foreignField: 'compartment',
            as: 'stock_doc'
          }
        }
      ])
      .then(async doc => {
        message = []
        if (doc[0].stock_doc.length > 0) {
          await message.push(
            'Please delete all the refered Stocks by this compartment'
          )
        }
        if (message.length > 0) {
          res.status(200).send({ success: true, message: message })
        } else if (message.length == 0) {
          compartmentModel
            .deleteOne({ _id: ObjectId(req.params.id), active_status: 1 })
            .then(branch => {
              res.status(200).send({
                success: true,
                message: 'Compartment Deleted Successfully!'
              })
              createLog(req.headers['authorization'], 'Compartment', 0)
            })
            .catch(err => {
              res
                .status(200)
                .send({ success: false, message: 'Compartment Not Found' })
            })
        }
      })
      .catch(err => {
        res
          .status(200)
          .send({ success: false, message: 'Compartment Not Found' })
      })
  } catch (err) {
    res
      .status(200)
      .send({ success: false, error: err, message: 'An Error Catched' })
  }
}
