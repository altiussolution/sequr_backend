const { ObjectId } = require('bson')
const { logModel, stockAllocationModel } = require('../models')
var moment = require('moment')
const { search } = require('../routes/users.route')

exports.transactionReport = (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false

  var searchString = req.query.searchString // Search Query
  var dateFrom = req.query.date // Direct Query
  var dateTo = req.query.date // Direct Query
  var cubeId = req.query.cube // Filter Query
  var user_id = req.query.user_id // Direct Query
  var action = req.query.type // Direct query
  var directQuery = { stock_allocation_id: { $exists: true } }
  var filterQuery = {}
  var searchQuery = [{}]

  // Aggregation Queries
  if (dateFrom) {
    var fromDate = moment(dateFrom).format('YYYY-MM-DD 00:00:00')
    var toDate = moment(dateTo).format('YYYY-MM-DD 23:59:59')
    directQuery['created_at'] = {
      $gt: new Date(fromDate),
      $lt: new Date(toDate)
    }
  }
  if (user_id) directQuery['user_id'] = ObjectId(user_id)
  if (action) directQuery['action'] = action
  if (cubeId) filterQuery['stock_allocation_doc.cube_id'] = ObjectId(cubeId)
  if (searchString) {
    searchQuery = [
      {
        'stock_allocation_doc.cube_name': { $regex: searchString }
      },
      {
        'item_doc.item_name': { $regex: searchString }
      },
      {
        action: { $regex: searchString }
      },
      {
        'user_doc.first_name': { $regex: searchString }
      },
      {
        'column_doc.bin_name': { $regex: searchString }
      },
      {
        'draw_doc.compartment_name': { $regex: searchString }
      },
      {
        trasaction_qty: parseInt(searchString)
      }
    ]
  }
  console.log(directQuery)
  console.log(filterQuery)
  console.log(searchQuery)

  // Aggregation Queries

  try {
    logModel
      .aggregate([
        //Find branch id and active_status is 1
        {
          $match: {
            $and: [directQuery]
          }
        },
        // *** 1 ***
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user_doc'
          }
        },
        // *** 2 ***
        {
          $lookup: {
            from: 'stockallocations',
            localField: 'stock_allocation_id',
            foreignField: '_id',
            as: 'stock_allocation_doc'
          }
        },
        // *** 3 ***
        {
          $lookup: {
            from: 'cubes',
            localField: 'stock_allocation_doc.cube',
            foreignField: '_id',
            as: 'cube_doc'
          }
        },
        // *** 4 ***
        {
          $lookup: {
            from: 'bins',
            localField: 'stock_allocation_doc.bin',
            foreignField: '_id',
            as: 'column_doc'
          }
        },
        // *** 5 ***
        {
          $lookup: {
            from: 'compartments',
            localField: 'stock_allocation_doc.compartment',
            foreignField: '_id',
            as: 'draw_doc'
          }
        },
        // *** 6 ***
        {
          $lookup: {
            from: 'items',
            localField: 'stock_allocation_doc.item',
            foreignField: '_id',
            as: 'item_doc'
          }
        },
        {
          $match: filterQuery
        },
        {
          $match: {
            $or: searchQuery
          }
        }
      ])
      .sort({ created_at: 1 })
      //   .skip(offset)
      .limit(limit)
      .then(logs => {
        res.status(200).send({ success: true, data: logs })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.overallStockReport = (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
  var searchString = req.query.searchString
  var in_stock = req.query.in_stock
  var query = searchString
    ? { active_status: 1, $text: { $search: searchString } }
    : { active_status: 1 }
  if (in_stock) {
    query['in_stock'] = parseInt(in_stock)
  }
  try {
    itemModel
      .find(query)
      .populate('category_id')
      .populate('sub_category_id')
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
exports.deadStockReport = async (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false

  var searchString = req.query.searchString // Search Query
  var dateFrom = req.query.date // Direct Query
  var dateTo = req.query.date // Direct Query
  var cubeId = req.query.cube // Direct Query
  var columnId = req.query.columnId // Direct Query

  // Get Date before 30 days from current date
  dateForOutOfStock = await calculatDate(30)
  var beforeOneMonth = moment(dateForOutOfStock).format('YYYY-MM-DD 00:00:00')

  var directQuery = {
    updated_at: { $lt: new Date(beforeOneMonth) }
  }
  var filterQuery = {}
  var searchQuery = [{}]

  // Aggregation Queries
  if (dateFrom) {
    var fromDate = moment(dateFrom).format('YYYY-MM-DD 00:00:00')
    var toDate = moment(dateTo).format('YYYY-MM-DD 23:59:59')
    filterQuery['updated_at'] = {
      $gt: new Date(fromDate),
      $lt: new Date(toDate)
    }
  }
  if (cubeId) directQuery['cube'] = ObjectId(cubeId)
  if (columnId) directQuery['bin'] = ObjectId(columnId)

  if (searchString) {
    searchQuery = [
      {
        'cube_doc.cube_name': { $regex: searchString }
      },
      {
        'item_doc.item_name': { $regex: searchString }
      },
      {
        'column_doc.bin_name': { $regex: searchString }
      },
      {
        'draw_doc.compartment_name': { $regex: searchString }
      },
      {
        quantity: parseInt(searchString)
      }
    ]
  }
  console.log(directQuery)
  console.log(filterQuery)
  console.log(searchQuery)

  // Aggregation Queries

  try {
    stockAllocationModel
      .aggregate([
        //Find branch id and active_status is 1
        {
          $match: {
            $and: [directQuery]
          }
        },
        // *** 1 ***
        // *** 2 ***
        // *** 3 ***
        {
          $lookup: {
            from: 'cubes',
            localField: 'cube',
            foreignField: '_id',
            as: 'cube_doc'
          }
        },
        // *** 4 ***
        {
          $lookup: {
            from: 'bins',
            localField: 'bin',
            foreignField: '_id',
            as: 'column_doc'
          }
        },
        // *** 5 ***
        {
          $lookup: {
            from: 'compartments',
            localField: 'compartment',
            foreignField: '_id',
            as: 'draw_doc'
          }
        },
        // *** 6 ***
        {
          $lookup: {
            from: 'items',
            localField: 'item',
            foreignField: '_id',
            as: 'item_doc'
          }
        },
        {
          $match: filterQuery
        },
        {
          $match: {
            $or: searchQuery
          }
        }
      ])
      .sort({ created_at: 1 })
      //   .skip(offset)
    //   .limit(limit)
      .then(logs => {
        res.status(200).send({ success: true, data: logs })
      })
    //   .catch(error => {
    //     res.status(400).send({ success: false, error: error })
    //   })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}
async function calculatDate (subtractDay) {
  var d = new Date()
  await d.setDate(d.getDate() - subtractDay)
  var date = await d.toISOString().slice(0, 10)
  return date
}
