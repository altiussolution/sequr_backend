const {
  itemModel,
  stockAllocationModel,
  binModel,
  compartmentModel,
  cubeModel
} = require('../models')
const { appRouteModels } = require('../utils/enum.utils')
const { createLog } = require('../middleware/crud.middleware')
var { error_code } = require('../utils/enum.utils')
var ObjectId = require('mongodb').ObjectID
const { ObjectID } = require('bson')
// exports.addItem = async (req, res) => {
//   try {
//     var newItem = new itemModel(req.body)
//     newItem.save(function (err) {
//       if (err) {
//         console.log(err)
//         if (err.keyValue.item_number) {
//           var errorMessage =
//             err.code == error_code.isDuplication
//               ? 'Item Number is already exist'
//               : err
//         }
//         res.status(409).send({
//           success: false,
//           message: errorMessage
//         })
//       } else {
//         res
//           .status(200)
//           .send({ success: true, message: 'Item Added Successfully!' })
//       }
//     })
//   } catch (error) {
//     res.send('An error occured')
//     console.log(error)
//   }
// }
exports.addItem = (req, res) => {
  // Change your function name
  try {
    var newItem = new itemModel(req.body) // Change model name
    newItem.save((err, doc) => {
      // past model body
      if (!err) {
        res
          .status(200)
          .send({ success: true, message: 'Item Created Successfully!' }) //Change your meassage
        createLog(req.headers['authorization'], 'Item', 2) // Change Logs
      } else if (err) {
        if (err.code == 11000) {
          res.status(422).send({
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

exports.getItem = (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
  var searchString = req.query.searchString
  var category_id = req.query.category_id
  var sub_category_id = req.query.sub_category_id
  var is_active = req.query.is_active
  var is_item = req.query.is_item
  var is_gages = req.query.is_gages
  var supplier = req.query.supplier
  var company_id = req.query.company_id
  var moment = require('moment')
  var dateFrom = req.query.dateFrom // Direct Query
  var dateTo = req.query.dateTo // Direct Query
  var query = searchString
    ? {
        active_status: 1,
        company_id: company_id,
        $text: { $search: searchString }
      }
    : { active_status: 1, company_id: company_id }
  if (category_id) query['category_id'] = category_id
  if (sub_category_id) query['sub_category_id'] = sub_category_id
  if (is_active) query['is_active'] = is_active
  if (is_item) query['is_active'] = is_item
  if (is_gages) query['is_gages'] = is_gages
  if (supplier) query['supplier'] = supplier
  if (company_id) query['company_id'] = company_id
  if (dateFrom) {
    var fromDate = moment(dateFrom).format('YYYY-MM-DD 00:00:00')
    var toDate = moment(dateTo).format('YYYY-MM-DD 23:59:59')
    query['calibration_month'] = {
      $gt: new Date(fromDate),
      $lt: new Date(toDate)
    }
  }
  // Date Filter

  try {
    itemModel
      .find(query)
      .populate('category_id')
      .populate('sub_category_id')
      .populate('supplier.suppliedBy')
      .skip(offset)
      .limit(limit)
      .then(item => {
        res.status(200).send({ success: true, item: item })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.updateItem = async (req, res) => {
  try {
    itemModel.findByIdAndUpdate(req.params.id, req.body, (err, file) => {
      if (file)
        res.send({
          status: 'Success',
          message: 'item Updated'
        })
      else {
        res.send({ message: 'Not Found' })
      }
    })
  } catch (error) {
    res.send('An error occured')
    console.log(error)
  }
}

exports.upload = async (req, res) => {
  try {
    var fileLocations = {}
    if (req.files) {
      if (
        req.files.length === 2 &&
        req.files[0].mimetype.startsWith('image') &&
        req.files[1].mimetype.startsWith('video')
      ) {
        fileLocations['image_path'] = `${req.files[0].destination.replace(
          './src/public/',
          appRouteModels.BASEURL
        )}/${req.files[0].originalname}`
        fileLocations['video_path'] = `${req.files[1].destination.replace(
          './src/public/',
          appRouteModels.BASEURL
        )}/${req.files[1].originalname}`
      } else if (
        req.files.length === 1 &&
        req.files[0].mimetype.startsWith('image')
      ) {
        fileLocations['image_path'] = `${req.files[0].destination.replace(
          './src/public/',
          appRouteModels.BASEURL
        )}/${req.files[0].originalname}`
      } else if (
        req.files.length === 1 &&
        req.files[0].mimetype.startsWith('video')
      ) {
        fileLocations['video_path'] = `${req.files[0].destination.replace(
          './src/public/',
          appRouteModels.BASEURL
        )}/${req.files[0].originalname}`
      } else {
        fileLocations['image_path'] = `${req.files[1].destination.replace(
          './src/public/',
          appRouteModels.BASEURL
        )}/${req.files[1].originalname}`
        fileLocations['video_path'] = `${req.files[0].destination.replace(
          './src/public/',
          appRouteModels.BASEURL
        )}/${req.files[0].originalname}`
      }

      res.status(200).send({
        message: 'Profile Added Sucessfully',
        fileLocations: fileLocations
      })
    }
  } catch (err) {
    res.status(400).send(err)
  }
}

exports.getItemByCategory = async (req, res) => {
  var company_id = req.query.company_id
  try {
    var itemsInCategory = await itemModel
      .find({
        active_status: 1,
        company_id: company_id,
        is_active: true,
        category_id: req.params.category_id,
        sub_category_id: req.params.sub_category_id
      })
      .populate('supplier.suppliedBy')
      .exec()
    res.status(200).send({ data: itemsInCategory })
  } catch (err) {
    res.status(400).send(err)
  }
}

exports.getItemById = async (req, res) => {
  try {
    var company_id = req.query.company_id
    var item = req.params.item
    var itemDetails = await itemModel.findById(item).exec()
    var stockDetails = await stockAllocationModel
      .findOne({ item: item, company_id: company_id })
      .populate('cube')
      .populate('bin')
      .populate('compartment')
    res.status(200).send({
      status: true,
      items: itemDetails,
      machine: stockDetails ? stockDetails : false
    })
  } catch (err) {
    res.status(400).send({ status: false, message: err.name })
  }
}

exports.deleteItems = (req, res) => {
  // try {
  //   itemModel
  //     .findByIdAndUpdate(req.params.id, { active_status: 0 })
  //     .then(item => {
  //       res
  //         .status(200)
  //         .send({ success: true, message: 'Item  Deleted Successfully!' })
  //       createLog(req.headers['authorization'], 'Item', 0)
  //     })
  //     .catch(err => {
  //       res.status(200).send({ success: false, message: 'Item Not Found' })
  //     })
  // } catch (err) {
  //   res
  //     .status(200)
  //     .send({ success: false, error: err, message: 'An Error Catched' })
  // }
  try {
    itemModel
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
            foreignField: 'item',
            as: 'stock_doc'
          }
        },
        {
          $lookup: {
            from: 'kits',
            localField: '_id',
            foreignField: 'kit_data.item_id',
            as: 'kit_doc'
          }
        },
        {
          $lookup: {
            from: 'purchaseorders',
            localField: '_id',
            foreignField: 'item_id',
            as: 'po_doc'
          }
        },
        {
          $lookup: {
            from: 'carts',
            localField: '_id',
            foreignField: 'cart.item',
            as: 'cart_doc'
          }
        }
      ])
      .then(async doc => {
        message = []
        if (doc[0].stock_doc.length > 0) {
          await message.push(
            'Please delete all the refered stocks by this item'
          )
        }
        if (doc[0].kit_doc.length > 0) {
          await message.push('Please delete all the refered kits by this item')
        }
        if (doc[0].po_doc.length > 0) {
          await message.push(
            'Please delete all the refered purchase orders by this item'
          )
        }
        if (doc[0].cart_doc.length > 0) {
          await message.push('Please remove this item in the cart')
        }
        if (message.length > 0) {
          res.status(200).send({ success: true, message: message })
        } else if (message.length == 0) {
          itemModel
            .deleteOne({ _id: ObjectId(req.params.id), active_status: 1 })
            .then(branch => {
              res.status(200).send({
                success: true,
                message: 'Item Deleted Successfully!'
              })
              createLog(req.headers['authorization'], 'Item', 0)
            })
            .catch(err => {
              res
                .status(200)
                .send({ success: false, message: 'Item Not Found' })
            })
        }
      })
  } catch (err) {
    res
      .status(200)
      .send({ success: false, error: err, message: 'An Error Catched' })
  }
}

// exports.getItemfilter = (req, res) => {
//   var query = searchString
//   ? { active_status: 1, $text: { $search: searchString } }
//   : { active_status: 1 }
// if (category_id) query['category_id'] = category_id
// if (sub_category_id) query['sub_category_id'] = sub_category_id
//   try {
//     itemModel
//       .find(query)
//       .populate('category_id')
//       .populate('sub_category_id')
//       .then(item => {
//         res.status(200).send({ success: true, item: item })
//       })
//       .catch(error => {
//         res.status(400).send({ success: false, error: error })
//       })
//   } catch (error) {
//     res.status(201).send({ success: false, error: error })
//   }
// }

exports.uploadImage = async (req, res) => {
  try {
    console.log(req.files)
    totalImages = []
    for (let image of req.files) {
      fileLocations = {}
      fileLocations['image_path'] = `${image.destination.replace(
        './src/public/',
        appRouteModels.BASEURL
      )}/${image.originalname}`
      totalImages.push(fileLocations)
    }
    res.status(200).send({
      message: 'Image Added Sucessfully',
      fileLocations: totalImages
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

exports.getItemMachine = (req, res) => {
  var company_id = req.query.company_id
  var columnIds = []
  if (req.query.column_ids) {
    var columnIds = JSON.parse(req.query.column_ids)
  }
  console.log(req.query)
  try {
    cubeModel
      .distinct('_id', {
        active_status: 1,
        company_id: company_id,
        employee_status: true
      })
      .then(cubeList => {
        console.log('cube list, ' + cubeList)
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
            console.log('bin list, ' + binList)
            console.log(binList)
            compartmentModel
              .distinct('_id', {
                active_status: 1,
                bin_id: { $in: binList },
                is_removed: false
              })
              .then(drawList => {
                console.log('draw list, ' + drawList)
                //Find all Item Ids in stock allocation
                stockAllocationModel
                  .distinct('item', {
                    active_status: 1,
                    compartment: { $in: drawList }
                  })
                  .then(itemsList => {
                    console.log('items list, ' + itemsList)
                    var query = {
                      active_status: 1,
                      is_active: true,
                      category_id: req.query.category_id,
                      sub_category_id: req.query.sub_category_id,
                      _id: { $in: itemsList }
                    }

                    // Find All items in machine
                    itemModel
                      .find(query)
                      .populate('category_id')
                      .populate('sub_category_id')
                      .populate('supplier.suppliedBy')
                      .then(item => {
                        console.log('item, ' + item)

                        res.status(200).send({ success: true, data: item })
                      })
                      .catch(error => {
                        res.status(400).send({ success: false, error: error })
                      })
                  })
                  .catch(error => {
                    res.status(400).send({ success: false, error: error })
                  })
              })
          })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}
