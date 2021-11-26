const {
  subCategoryModel,
  binModel,
  stockAllocationModel,
  compartmentModel,
  cubeModel
} = require('../models')
const { appRouteModels } = require('../utils/enum.utils')
const { createLog } = require('../middleware/crud.middleware')
var ObjectId = require('mongodb').ObjectID
const { ObjectID } = require('bson')

exports.addsubCategory = async (req, res) => {
  try {
    const subCategory = new subCategoryModel(req.body)
    var isSubExist = await subCategoryModel
      .findOne({
        $or: [
          { sub_category_name: req.body.sub_category_name },
          { sub_category_code: req.body.sub_category_code }
        ]
      })
      .exec()
    if (isSubExist) {
      const name = await subCategoryModel
        .findOne({
          sub_category_name: req.body.sub_category_name,
          active_status: 1
        })
        .exec()
      const id = await subCategoryModel
        .findOne({
          sub_category_code: req.body.sub_category_code,
          active_status: 1
        })
        .exec()
      if (name) {
        res.status(200).send({
          success: false,
          message: 'SubCategory name Already Exist'
        })
      } else if (id) {
        res.status(200).send({
          success: false,
          message: 'SubCategory code Already Exist'
        })
      }
    } else if (!isSubExist) {
      subCategory.save(err => {
        if (!err) {
          res.status(200).send({
            success: true,
            message: 'Sub Category Created Successfully!'
          })
          createLog(req.headers['authorization'], 'SubCategory', 2)
        }
      })
    }
  } catch (err) {
    res.status(201).send({ success: false, error: err })
  }
}

exports.getsubCategory = async (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
  var searchString = req.query.searchString
  var categoryId = req.query.category_id
  var company_id = req.query.company_id

  var query = searchString
    ? {
        active_status: 1,
        category_id: categoryId,
        company_id: company_id,
        $text: { $search: searchString }
      }
    : { active_status: 1, category_id: categoryId }
  // var popVal = categoryId ? null : 'category_id'
  try {
    subCategoryModel
      .find(query)
      .populate('category_id')
      .skip(offset)
      .limit(limit)
      .then(categories => {
        res.status(200).send({ success: true, data: categories })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.updatesubCategory = async (req, res) => {
  console.log(req.params.id)
  try {
    subCategoryModel
      .findByIdAndUpdate(req.params.id, req.body)
      .then(binUpdate => {
        res.status(200).send({
          success: true,
          message: 'Sub Category Updated Successfully!'
        })
        createLog(req.headers['authorization'], 'SubCategory', 1)
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

exports.upload = async (req, res) => {
  try {
    if (req.file) {
      const filename = req.file.originalname
      res.status(200).send({
        Message: 'Image Added Sucessfully',
        Path: `${req.file.destination.replace(
          './src/public/',
          appRouteModels.BASEURL
        )}/${filename}`
      })
    }
  } catch (err) {
    res.status(400).send(err)
  }
}

// exports.getsubCategoryfilter = async (req, res) => {
//   //var category_id = req.query.categoryId;
//   var sub_category_name = req.query.sub_category_name
//   var sub_category_code = req.query.sub_category_code
//   if (sub_category_name && sub_category_code) {
//     var query = {
//       sub_category_name: sub_category_name,
//       sub_category_code: sub_category_code
//     }
//   } else if (sub_category_name) {
//     var query = { sub_category_name: sub_category_name }
//   } else if (sub_category_code) {
//     var query = { sub_category_code: sub_category_code }
//   }
//   subCategoryModel
//     .find(query)
//     .populate('category_id')
//     .then(subCategory => {
//       res.status(200).send({ success: true, data: subCategory })
//     })
//     .catch(error => {
//       res.status(400).send({ success: false, error: error })
//     })
// }

exports.getSubCategoryMachine = (req, res) => {
  var columnIds = []
  var company_id = req.query.company_id
  if (req.query.column_ids) {
    var columnIds = JSON.parse(req.query.column_ids)
  }
  try {
    cubeModel
      .distinct('_id', {
        active_status: 1,
        company_id: company_id,
        employee_status: true
      })
      .then(cubeList => {
        //Find all Columns Ids
        binModel
          .distinct('_id', {
            active_status: 1,
            cube_id: { $in: cubeList },
            bin_id: { $in: columnIds },
            company_id: company_id,
            is_removed: false
          })
          .then(binList => {
            console.log(binList)
            compartmentModel
              .distinct('_id', {
                active_status: 1,
                bin_id: { $in: binList },
                is_removed: false
              })
              .then(drawList => {
                console.log(drawList)
                //Find all Item Ids in stock allocation
                stockAllocationModel
                  .distinct('sub_category', {
                    active_status: 1,
                    compartment: { $in: drawList }
                  })
                  .then(sub_cat => {
                    console.log(sub_cat)
                    var query = {
                      active_status: 1,
                      is_active: true,
                      category_id: req.query.category_id,
                      _id: { $in: sub_cat }
                    }
                    console.log(sub_cat)

                    // Find All items in machine
                    subCategoryModel
                      .find(query)
                      .populate('category_id')
                      .then(sub_category => {
                        res
                          .status(200)
                          .send({ success: true, data: sub_category })
                      })
                      .catch(error => {
                        res
                          .status(400)
                          .send({ success: false, error: error.name })
                      })
                  })
                  .catch(error => {
                    res.status(400).send({ success: false, error: error.name })
                  })
              })
              .catch(error => {
                res.status(400).send({ success: false, error: error })
              })
          })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}
// exports.getUsersubCategory = async (req, res) => {
//   var offset =
//     req.query.offset != undefined ? parseInt(req.query.offset) : false
//   var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
//   var searchString = req.query.searchString
//   var categoryId = req.query.category_id
//   var company_id = req.query.company_id
//   var query = searchString
//     ? {
//         active_status: 1,
//         category_id: categoryId,
//         company_id:company_id,
//         $text: { $search: searchString },
//         is_active: true
//       }
//     : { active_status: 1, category_id: categoryId }
//   // var popVal = categoryId ? null : 'category_id'
//   try {
//     subCategoryModel
//       .find(query)
//       .populate('category_id')
//       .skip(offset)
//       .limit(limit)
//       .then(categories => {
//         res.status(200).send({ success: true, data: categories })
//       })
//       .catch(error => {
//         res.status(400).send({ success: false, error: error })
//       })
//   } catch (error) {
//     res.status(201).send({ success: false, error: error })
//   }
// }

exports.deletesubCategory = async (req, res) => {
  try {
    subCategoryModel
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
            foreignField: 'sub_category',
            as: 'stock_doc'
          }
        },
        {
          $lookup: {
            from: 'kits',
            localField: '_id',
            foreignField: 'kit_data.sub_category_id',
            as: 'kit_doc'
          }
        },
        {
          $lookup: {
            from: 'purchaseorders',
            localField: '_id',
            foreignField: 'sub_category_id',
            as: 'po_doc'
          }
        }
      ])
      .then(async doc => {
        message = []
        if (doc[0].stock_doc.length > 0) {
          await message.push(
            'Please delete all the refered stocks by this subcategory'
          )
        }
        if (doc[0].kit_doc.length > 0) {
          await message.push(
            'Please delete all the refered kits by this subcategory'
          )
        }
        if (doc[0].po_doc.length > 0) {
          await message.push(
            'Please delete all the refered purchase orders by this subcategory'
          )
        }

        if (message.length > 0) {
          res.status(200).send({ success: true, message: message })
        } else if (message.length == 0) {
          subCategoryModel
            .deleteOne({ _id: ObjectId(req.params.id), active_status: 1 })
            .then(subCategory => {
              res.status(200).send({
                success: true,
                message: 'Subcategory Deleted Successfully!'
              })
              createLog(req.headers['authorization'], 'SubCategory', 0)
            })
            .catch(err => {
              res
                .status(200)
                .send({ success: false, message: 'SubCategory Not Found' })
            })
        }
      })
  } catch (err) {
    res
      .status(200)
      .send({ success: false, error: err, message: 'An Error Catched' })
  }
}
