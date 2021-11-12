const { result } = require('lodash')
const {
  categoryModel,
  subCategoryModel,
  itemModel,
  stockAllocationModel,
  binModel
} = require('../models')
var { error_code, appRouteModels } = require('../utils/enum.utils')
const { createLog } = require('../middleware/crud.middleware')

exports.addCategory = (async (req, res) => {
  try{
      var category = new categoryModel(req.body);
      var isCategoryExist = await categoryModel.findOne({ $or: [{category_name : req.body.category_name},{category_code: req.body.category_code} ] }).exec()
      if(isCategoryExist){
       const name = await categoryModel.findOne(({category_name: req.body.category_name ,active_status: 1 })).exec()
       const code = await categoryModel.findOne(({ category_code:req.body.category_code ,  active_status: 1 })).exec()
       if(name){
           res.status(200).send({
               success: false,
               message: 'Category Name Already Exist'
           });
       }
       if(code){
           res.status(200).send({
               success: false,
               message: 'Category code Already Exist'
           });
       }
      

      }
      else if(!isCategoryExist){
       category.save((err) =>{  
           if(!err){
               res.status(200).send({ success: true, message: 'Category Created Successfully!' });
               createLog(req.headers['authorization'], 'Category', 2)
           }
          })
      }
      
     
  }catch(err){
   res.status(201).send({success: false, error : err.name})
  }
})


exports.getCategory = async (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
  var searchString = req.query.searchString
  var query = searchString
    ? { active_status: 1, $text: { $search: searchString } }
    : { active_status: 1 }
  try {
    categoryModel
      .find(query)
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

exports.updateCategory = async (req, res) => {
  try {
    categoryModel
      .findByIdAndUpdate(req.params.id, req.body)
      .then(binUpdate => {
        res
          .status(200)
          .send({ success: true, message: 'Category Updated Successfully!' })
        createLog(req.headers['authorization'], 'Category', 1)
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
      var filename = req.file.originalname
      res
        .status(200)
        .send({
          message: 'Category Image Sucessfully',
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

exports.deleteCategory = async (req, res) => {
  try {
    var catId = req.params.id
    categoryModel
      .deleteOne({ _id: catId })
      .then(result => {
        if (result.deletedCount) {
          subCategoryModel
            .deleteMany({}, { category_id: catId })
            .then(subResult => {
              itemModel
                .deleteMany({}, { category_id: catId })
                .then(itemRestul => {
                  res
                    .status(200)
                    .send({
                      status: true,
                      message: 'Category and all the references were deleted'
                    })
                  createLog(req.headers['authorization'], 'Category', 0)
                })
            })
        } else {
          res.status(200).send({ status: true, message: 'Category not found' })
        }
      })
      .catch(err => {
        console.log(err, 'catch error')
      })
  } catch (err) {
    res.status(400).send(err)
  }
}

exports.getCategorylist = async (req, res) => {
  var query = { active_status: 1 }
  var categories = []
  try {
    await categoryModel
      .find(query)
      .then(async category => {
        for (let cat of category) {
          var subCategory = await subCategoryModel
            .find({ category_id: cat._id })
            .exec()
          categories.push({
            ...{ category: cat },
            ...{ sub_category: subCategory }
          })
        }
        await res.status(200).send({ success: true, data: await categories })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error.name })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.getCategoryfilter = (req, res) => {
  var is_active = req.query.is_active
  //var query = (searchString ? { active_status: 1, $text: { $search: searchString } } : { active_status: 1 },(categoryCode ? { active_status: 1, $text: { $search: categoryCode } } : { active_status: 1 }))
  //var query = (category_name ? { active_status: 1, category_name : category_name }(category_code ? { active_status: 1,  category_code : category_code } )

  if (is_active) {
    var query = { is_active: is_active }
  }
  categoryModel
    .find(query)
    .then(category => {
      res.status(200).send({ success: true, data: category })
    })
    .catch(error => {
      res.status(400).send({ success: false, error: error })
    })
}

exports.getCategoryMachine = (req, res) => {
  var columnIds = JSON.parse(req.params.column_ids)

  try {
    //Find all Columns Ids
    binModel
      .distinct('_id', { active_status: 1, bin_id: { $in: columnIds } })
      .then(binList => {
        console.log(binList)
        //Find all Item Ids in stock allocation
        stockAllocationModel
          .distinct('category', { active_status: 1, bin: { $in: binList } })
          .then(category => {
            console.log(category)
            var query = {
              active_status: 1,
              is_active: true,
              _id: { $in: category }
            }
            console.log(category)

            // Find All items in machine
            categoryModel
              .find(query)
              .then(category => {
                res.status(200).send({ success: true, data: category })
              })
              .catch(error => {
                res.status(400).send({ success: false, error: error })
              })
          })
          .catch(error => {
            res.status(400).send({ success: false, error: error })
          })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}


exports.getUserCategory = (async (req, res) => {
  var offset = req.query.offset != undefined ? parseInt(req.query.offset) : false;
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false;
  var searchString = req.query.searchString
  var query = (searchString ? {active_status: 1, $text: {$search: searchString},is_active:true} : {active_status: 1})
  try{
      categoryModel.find(query).skip(offset).limit(limit).then(categories =>{
          res.status(200).send({ success: true, data: categories });
      }).catch(error => {
          res.status(400).send({success: false, error : error})
      })
  } catch(error){
      res.status(201).send({success: false, error : error})
  }
})