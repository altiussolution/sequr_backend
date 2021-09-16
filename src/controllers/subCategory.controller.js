const { subCategoryModel } = require('../models')
const { appRouteModels } = require('../utils/enum.utils');


exports.addsubCategory = async (req, res) => {
  try {
    const subCategory = new subCategoryModel(req.body)
    subCategory.save(err => {
      if (!err) {
        res
          .status(200)
          .send({
            success: true,
            message: 'Sub Category Created Successfully!'
          })
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
  var offset = parseInt(req.query.offset);
  var limit = parseInt(req.query.limit);
  var searchString = req.query.searchString;
  var query = (searchString ? { active_status: 1, $text: { $search: searchString } } : { active_status: 1 })
  try {
      subCategoryModel.find(query).populate("category_id").skip(offset).limit(limit).then(categories => {
        res.status(200).send({ success: true, data: categories })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

// exports.getBranch = (req, res) => {
//   var offset = parseInt(req.query.offset);
//   var limit = parseInt(req.query.limit);
//   var searchString = req.query.searchString;
//   var query = (searchString ? { active_status: 1, $text: { $search: searchString } } : { active_status: 1 })
//   try {
//       branchModel.find(query).populate("country_id").populate("state_id").populate("city_id").skip(offset).limit(limit).then(branch => {
//           res.status(200).send({ success: true, data: branch });
//       }).catch(error => {
//           res.status(400).send({ success: false, error: error })
//       })
//   } catch (error) {
//       res.status(201).send({ success: false, error: error })
//   }
// }

exports.updatesubCategory = async (req, res) => {
  console.log(req.params.id)
  try {
    subCategoryModel
      .findByIdAndUpdate(req.params.id, req.body)
      .then(binUpdate => {
        res
          .status(200)
          .send({ success: true, message: 'Sub Category Updated Successfully!' })
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
        Path: `${req.file.destination.replace('./src/public/', appRouteModels.BASEURL)}/${filename}`
      })
    }
  } catch (err) {
    res.status(400).send(err)
  }
}
