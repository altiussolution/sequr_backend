const { stockAllocationModel, itemModel, logModel } = require('../models')
const { createLog } = require('../middleware/crud.middleware')
var ObjectId = require('mongodb').ObjectID
const { ObjectID } = require('bson')
const { func } = require('joi')
exports.allocateStock = (req, res) => {
  try {
    var stock = new stockAllocationModel(req.body)
    stock.save((err, doc) => {
      if (!err) {
        res
          .status(200)
          .send({ success: true, message: 'Stock Allocated Successfully' })
        createItemAddLog(doc._id, req.body.total_quantity, req.body.company_id)
        itemModel
          .findByIdAndUpdate(ObjectId(req.body.item), {
            $inc: { in_stock: -req.body.total_quantity }
          })
          .exec()
        decrementStock(req.body.item)
        createLog(req.headers['authorization'], 'Itemoncube', 2)
      } else {
        res.status(201).send({ status: false, message: err.name })
      }
    })
  } catch (err) {
    res.status(201).send({ status: false, message: err.name })
  }
}

exports.getStockAllocations = (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
  var searchString = req.query.searchString
  var category = req.query.category
  var sub_category = req.query.sub_category
  var status = req.query.status
  var supplier = req.query.supplier
  var cube = req.query.cube
  var bin = req.query.bin
  var compartment = req.query.compartment
  var is_active = req.query.is_active
  var company_id = req.query.company_id
  var query = searchString
    ? {
        active_status: 1,
        company_id: company_id,
        $text: { $search: searchString }
      }
    : { active_status: 1, company_id: company_id }
  if (category) query['category'] = category
  if (sub_category) query['sub_category'] = sub_category
  if (is_active) query['is_active'] = is_active
  if (status) query['status'] = status
  if (supplier) query['supplier'] = supplier
  if (cube) query['cube'] = cube
  if (bin) query['bin'] = bin
  if (compartment) query['compartment'] = compartment
  if (company_id) query['company_id'] = company_id

  try {
    stockAllocationModel
      .find(query)
      .populate('item')
      .populate('compartment')
      .populate('sub_category')
      .populate('supplier')
      .populate('purchase_order')
      .populate('bin')
      .populate('category')
      .populate('cube')
      .skip(offset)
      .limit(limit)
      .then(stocks => {
        res.status(200).send({ success: true, data: stocks })
      })
      .catch(error => {
        console.log(error)
        res.status(400).send({ success: false, error: error.name })
      })
  } catch (error) {
    console.log(error.name)
    res.status(201).send({ success: false, error: error })
  }
}

exports.updateStockAllocation = (req, res) => {
  var stockId = req.params.id
  try {
    if (stockId) {
      stockAllocationModel
        .findByIdAndUpdate(stockId, req.body)
        .then(async stockUpdate => {
          if (stockUpdate) {
            res
              .status(200)
              .send({ success: true, message: 'Stock Updated Successfully!' })
            createLog(req.headers['authorization'], 'Itemoncube', 1)
            createItemAddLog(
              req.body._id,
              req.body.total_quantity,
              req.body.company_id
            )
            console.log(req.body.item)
            console.log(req.body.total_quantity)
            await itemModel
              .findByIdAndUpdate(ObjectId(req.body.item), {
                $inc: { in_stock: -req.body.total_quantity }
              })
              .exec()
            decrementStock(req.body.item)
          } else {
            res
              .status(200)
              .send({ success: false, message: 'No Record found for given id' })
          }
        })
        .catch(error => {
          res
            .status(201)
            .send({ success: false, error: error, message: 'An Error Occured' })
        })
    } else {
      res
        .status(201)
        .send({ success: false, message: 'An Error Occured stock id required' })
    }
  } catch (err) {
    res
      .status(201)
      .send({ success: false, error: err.name, message: 'An Error Catched' })
  }
}

exports.getItemById = (req, res) => {
  var company_id = req.query.company_id
  try {
    var item = req.params.item
    stockAllocationModel
      .findOne({ item: item, company_id: company_id })
      .populate('item')
      .populate('cube')
      .populate('bin')
      .populate('compartment')
      .then(data => {
        if (data) {
          res.status(200).send({ status: true, data })
        } else {
          res.status(200).send({ status: false, message: 'No Data Found' })
        }
      })
  } catch (err) {
    res.status(400).send({ status: false, message: err.name })
  }
}

// exports.getStockAllocationsfilter = (req, res) => {
//   var category_name = req.query.category_name
//   var sub_category_name = req.query.sub_category_name
//   var status = req.query.status
//   var supplier_name = req.query.supplier_name
//   var cube_name = req.query.cube_name

//   if (
//     category_name &&
//     sub_category_name &&
//     status &&
//     supplier_name &&
//     cube_name
//   ) {
//     var query = {
//       category_name: category_name,
//       sub_category_name: sub_category_name,
//       status: status,
//       supplier_name: supplier_name,
//       cube_name: cube_name
//     }
//   } else if (category_name && sub_category_name && supplier_name && cube_name) {
//     var query = {
//       category_name: category_name,
//       sub_category_name: sub_category_name,
//       supplier_name: supplier_name,
//       cube_name: cube_name
//     }
//   } else if (category_name && status && sub_category_name && cube_name) {
//     var query = {
//       category_name: category_name,
//       status: status,
//       sub_category_name: sub_category_name,
//       cube_name: cube_name
//     }
//   } else if (sub_category_name && status && supplier_name && cube_name) {
//     var query = {
//       sub_category_name: sub_category_name,
//       status: status,
//       supplier_name: supplier_name,
//       cube_name: cube_name
//     }
//   } else if (category_name && status && supplier_name && cube_name) {
//     var query = {
//       category_name: category_name,
//       status: status,
//       supplier_name: supplier_name,
//       cube_name: cube_name
//     }
//   } else if (category_name && status && supplier_name && sub_category_name) {
//     var query = {
//       category_name: category_name,
//       status: status,
//       supplier_name: supplier_name,
//       sub_category_name: sub_category_name
//     }
//   } else if (category_name && sub_category_name && cube_name) {
//     var query = {
//       category_name: category_name,
//       sub_category_name: sub_category_name,
//       cube_name: cube_name
//     }
//   } else if (category_name && supplier_name && cube_name) {
//     var query = {
//       category_name: category_name,
//       supplier_name: supplier_name,
//       cube_name: cube_name
//     }
//   } else if (category_name && status && cube_name) {
//     var query = {
//       category_name: category_name,
//       status: status,
//       cube_name: cube_name
//     }
//   } else if (sub_category_name && supplier_name && cube_name) {
//     var query = {
//       sub_category_name: sub_category_name,
//       supplier_name: supplier_name,
//       cube_name: cube_name
//     }
//   } else if (sub_category_name && status && cube_name) {
//     var query = {
//       sub_category_name: sub_category_name,
//       status: status,
//       cube_name: cube_name
//     }
//   } else if (status && supplier_name && cube_name) {
//     var query = {
//       status: status,
//       supplier_name: supplier_name,
//       cube_name: cube_name
//     }
//   } else if (category_name && supplier_name && sub_category_name) {
//     var query = {
//       category_name: category_name,
//       supplier_name: supplier_name,
//       sub_category_name: sub_category_name
//     }
//   } else if (category_name && status && sub_category_name) {
//     var query = {
//       category_name: category_name,
//       status: status,
//       sub_category_name: sub_category_name
//     }
//   } else if (supplier_name && status && sub_category_name) {
//     var query = {
//       supplier_name: supplier_name,
//       status: status,
//       sub_category_name: sub_category_name
//     }
//   } else if (category_name && sub_category_name) {
//     var query = {
//       category_name: category_name,
//       sub_category_name: sub_category_name
//     }
//   } else if (category_name && supplier_name) {
//     var query = { category_name: category_name, supplier_name: supplier_name }
//   } else if (category_name && status) {
//     var query = { category_name: category_name, status: status }
//   } else if (sub_category_name && supplier_name) {
//     var query = {
//       sub_category_name: sub_category_name,
//       supplier_name: supplier_name
//     }
//   } else if (sub_category_name && status) {
//     var query = { sub_category_name: sub_category_name, status: status }
//   } else if (status && supplier_name) {
//     var query = { status: status, supplier_name: supplier_name }
//   } else if (category_name && cube_name) {
//     var query = { category_name: category_name, cube_name: cube_name }
//   } else if (cube_name && supplier_name) {
//     var query = { cube_name: cube_name, supplier_name: supplier_name }
//   } else if (sub_category_name && cube_name) {
//     var query = { sub_category_name: sub_category_name, cube_name: cube_name }
//   } else if (status && cube_name) {
//     var query = { status: status, cube_name: cube_name }
//   } else if (supplier_name) {
//     var query = { supplier_name: supplier_name }
//   } else if (category_name) {
//     var query = { category_name: category_name }
//   } else if (sub_category_name) {
//     var query = { sub_category_name: sub_category_name }
//   } else if (status) {
//     var query = { status: status }
//   } else if (cube_name) {
//     var query = { cube_name: cube_name }
//   }
//   try {
//     stockAllocationModel
//       .find(query)
//       .populate('item')
//       .populate('compartment')
//       .populate('sub_category')
//       .populate('supplier')
//       .populate('purchase_order')
//       .populate('bin')
//       .populate('category')
//       .populate('cube')
//       .then(stocks => {
//         res.status(200).send({ success: true, data: stocks })
//       })
//       .catch(error => {
//         console.log(error)
//         res.status(400).send({ success: false, error: error.name })
//       })
//   } catch (error) {
//     console.log(error.name)
//     res.status(201).send({ success: false, error: error })
//   }
// }

exports.deleteStockAllocation = (req, res) => {
  try {
    stockAllocationModel
      .aggregate([
        {
          $match: {
            $and: [{ _id: ObjectId(req.params.id) }, { active_status: 1 }]
          }
        },
        {
          $lookup: {
            from: 'carts',
            localField: '_id',
            foreignField: 'cart.allocation',
            as: 'cart_doc'
          }
        }
      ])
      .then(async doc => {
        message = []
        if (doc[0].cart_doc.length > 0) {
          await message.push(
            'Please delete all the cart items refered to this stock'
          )
        }

        if (message.length > 0) {
          res.status(200).send({ success: true, message: message })
        } else if (message.length == 0) {
          stockAllocationModel
            .deleteOne({ _id: ObjectId(req.params.id), active_status: 1 })
            .then(stockAllocation => {
              res.status(200).send({
                success: true,
                message: 'StockAllocation Deleted Successfully!'
              })
              createLog(req.headers['authorization'], 'stockAllocation', 0)
            })
            .catch(err => {
              res
                .status(200)
                .send({ success: false, message: 'StockAllocation Not Found' })
            })
        }
      })
  } catch (err) {
    res
      .status(200)
      .send({ success: false, error: err, message: 'An Error Catched' })
  }
}

function createItemAddLog (stock_id, qty, company_id) {
  try {
    data = {}
    data['module_name'] = 'Item added on cube'
    data['action'] = 'Item added on cube'
    data['stock_allocation_id'] = stock_id
    data['trasaction_qty'] = qty
    data['company_id'] = company_id
    var log = new logModel(data)
    log.save(err => {
      if (!err) {
        console.log('Item  Added on Log Successfully!')
      } else {
        console.log('Log Not Created')
      }
    })
  } catch (error) {
    console.log('Something Went Wrong in Create Log')
  }
}

function decrementStock (_id) {
  try {
    itemModel.updateOne(
      { _id: ObjectId(_id), in_stock: { $lt: 0 } },
      { $set: { in_stock: 0 } }
    )
    console.log(' *** item decremented to zero *** ')
  } catch (err) {
    console.log(err)
  }
}
