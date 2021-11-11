const {
  subCategoryModel,
  binModel,
  stockAllocationModel
} = require('../models')
const { appRouteModels } = require('../utils/enum.utils')
const { createLog } = require('../middleware/crud.middleware')

exports.addsubCategory = async (req, res) => {
  try {
    const subCategory = new subCategoryModel(req.body)
    subCategory.save(err => {
      if (!err) {
        res.status(200).send({
          success: true,
          message: 'Sub Category Created Successfully!'
        })
        createLog(req.headers['authorization'], 'SubCategory', 2)
      } else {
        res.status(200).send({
          success: false,
          message: 'Error occured'
        })
      }
    })
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
  var query = searchString
    ? {
        active_status: 1,
        category_id: categoryId,
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

exports.getsubCategoryfilter = async (req, res) => {
  //var category_id = req.query.categoryId;
  var sub_category_name = req.query.sub_category_name
  var sub_category_code = req.query.sub_category_code
  if (sub_category_name && sub_category_code) {
    var query = {
      sub_category_name: sub_category_name,
      sub_category_code: sub_category_code
    }
  } else if (sub_category_name) {
    var query = { sub_category_name: sub_category_name }
  } else if (sub_category_code) {
    var query = { sub_category_code: sub_category_code }
  }
  subCategoryModel
    .find(query)
    .populate('category_id')
    .then(subCategory => {
      res.status(200).send({ success: true, data: subCategory })
    })
    .catch(error => {
      res.status(400).send({ success: false, error: error })
    })
}

exports.getSubCategoryMachine = (req, res) => {
  var columnIds = JSON.parse(req.params.column_ids)
  try {
    //Find all Columns Ids
    binModel
      .distinct('_id', { active_status: 1, bin_id: { $in: columnIds } })
      .then(binList => {
        console.log(binList)
        //Find all Item Ids in stock allocation
        stockAllocationModel
          .distinct('sub_category', { active_status: 1, bin: { $in: binList } })
          .then(sub_cat => {
            console.log(sub_cat)
            var query = {
              active_status: 1,
              category_id: req.params.category_id,
              _id: { $in: sub_cat }
            }
            console.log(sub_cat)

            // Find All items in machine
            subCategoryModel
              .find(query)
              .populate('category_id')
              .then(sub_category => {
                res.status(200).send({ success: true, data: sub_category })
              })
              .catch(error => {
                res.status(400).send({ success: false, error: error.name })
              })
          })
          .catch(error => {
            res.status(400).send({ success: false, error: error.name })
          })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}
exports.getUsersubCategory = async (req, res) => {
  var offset = req.query.offset != undefined ? parseInt(req.query.offset) : false;
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false;
  var searchString = req.query.searchString;
  var categoryId = req.query.category_id;
  var query = (searchString ? { active_status: 1, category_id:categoryId, $text: { $search: searchString },is_active:true } : { active_status: 1, category_id:categoryId })
  // var popVal = categoryId ? null : 'category_id'
  try {
      subCategoryModel.find(query).populate('category_id').skip(offset).limit(limit).then(categories => {
        res.status(200).send({ success: true, data: categories })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}