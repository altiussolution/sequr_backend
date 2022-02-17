const {
  logModel,
  stockAllocationModel,
  itemModel,
  purchaseOrderModel,
  kitModel
} = require('../models')
var moment = require('moment')
const { search } = require('../routes/users.route')
var crontab = require('node-crontab')
var ObjectId = require('mongodb').ObjectID
const { find } = require('../models/item.model')
const _ = require('lodash')

exports.transactionReport = (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
  console.log(limit)

  var searchString = req.query.searchString // Search Query
  var dateFrom = req.query.dateFrom // Direct Query
  var dateTo = req.query.dateTo // Direct Query
  var cubeId = req.query.cube // Filter Query
  var user_id = req.query.user_id // Direct Query
  var action = req.query.type // Direct query
  var itemLimit = req.query.itemLimit // filter query
  var role_id = req.query.role_id
  console.log(req.query)
  if (req.query.administration == 'true' || req.query.administration == true) {
    var directQuery = {
      module_name: { $nin: ['Item added on cube'] },
      company_id: ObjectId(req.query.company_id)
    }
  } else {
    var directQuery = {
      module_name: 'Machine Items',
      company_id: ObjectId(req.query.company_id)
    }
  }
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
  if (itemLimit) filterQuery['user_doc.item_max_quantity'] = parseInt(itemLimit)
  if (role_id) filterQuery['role_doc._id'] = ObjectId(role_id)
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
      },
      {
        'user_doc.item_max_quantity': parseInt(searchString)
      },
      {
        'role_doc.role_name': { $regex: searchString }
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
        { $sort: { created_at: -1 } },
        { $skip: offset },
        { $limit: limit },

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
          $lookup: {
            from: 'roles',
            localField: 'user_doc.role_id',
            foreignField: '_id',
            as: 'role_doc'
          }
        },
        {
          $match: {
            'role_doc.role_id': {
              $nin: ['$ SEQUR CUSTOMER $', '$ SEQUR SUPERADMIN $']
            }
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
      //   .sort({ created_at: -1 })
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
  var company_id = req.query.company_id
  var searchString = req.query.searchString
  var in_stock = req.query.in_stock
  var dateFrom = req.query.dateFrom
  var dateTo = req.query.dateTo
  var query = searchString
    ? {
        active_status: 1,
        company_id: company_id,
        $text: { $search: searchString }
      }
    : { active_status: 1, company_id: company_id }
  if (in_stock) {
    query['in_stock'] = parseInt(in_stock)
  }
  if (dateFrom) {
    var fromDate = moment(dateFrom).format('YYYY-MM-DD 00:00:00')
    var toDate = moment(dateTo).format('YYYY-MM-DD 23:59:59')
    query['calibration_month'] = {
      $gt: new Date(fromDate),
      $lt: new Date(toDate)
    }
  }
  try {
    itemModel
      .find(query)
      .populate('category_id')
      .populate('sub_category_id')
      .skip(offset)
      .limit(limit)
      .then(async item => {
        itemListWithPrices = []
        for await (let itemId of item) {
          totalItemPurchaseValue = await purchaseOrderModel
            .aggregate([
              {
                $match: {
                  $and: [
                    {
                      item_id: itemId._id,
                      is_received: 2,
                      remains_qty_after_allocation: { $exists: true },
                      price_per_qty: { $exists: true }
                    }
                  ]
                }
              },
              {
                $group: {
                  _id: null,
                  totalAmount: {
                    $sum: {
                      $multiply: [
                        '$price_per_qty',
                        '$remains_qty_after_allocation'
                      ]
                    }
                  }
                }
              }
            ])
            .exec()
          console.log(totalItemPurchaseValue)
          totalItemList = JSON.parse(JSON.stringify(itemId))
          if (totalItemPurchaseValue.length > 0) {
            console.log(totalItemPurchaseValue[0].totalAmount)
            totalItemList['purchased_value'] = await totalItemPurchaseValue[0]
              .totalAmount
          }
          await itemListWithPrices.push(totalItemList)
        }
        res.status(200).send({ success: true, item: itemListWithPrices })
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
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : 20

  var searchString = req.query.searchString // Search Query
  var dateFrom = req.query.date // Direct Query
  var dateTo = req.query.date // Direct Query
  var cubeId = req.query.cube // Direct Query
  var columnId = req.query.columnId // Direct Query

  // Get Date before 30 days from current date
  dateForOutOfStock = await calculatDate(30)
  var beforeOneMonth = moment(dateForOutOfStock).format('YYYY-MM-DD 00:00:00')

  var directQuery = {
    updated_at: {
      $lt: new Date(beforeOneMonth)
    },
    company_id: req.query.company_id
  }
  var filterQuery = { active_status: 1 }
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
  if (cubeId) filterQuery['cube'] = ObjectId(cubeId)
  if (columnId) filterQuery['bin'] = ObjectId(columnId)

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
        { $sort: { created_at: -1 } },
        { $skip: offset },
        { $limit: limit },
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
      //   .sort({ created_at: -1 })
      //   .skip(offset)
      //   .limit(limit)
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
exports.stockShortageReport = async (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : 20

  var searchString = req.query.searchString // Search Query
  var cubeId = req.query.cube // Direct Query
  var columnId = req.query.columnId // Direct Query

  var directQuery = { company_id: ObjectId(req.query.company_id) }
  var filterQuery = {}
  var searchQuery = [{}]

  // Aggregation Queries

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
        'item_doc.quantity': parseInt(searchString)
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
        { $sort: { created_at: -1 } },
        { $skip: offset },
        { $limit: limit },
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

        // {
        //   $match: { $expr: { $lte: ['$quantity', '$draw_doc.item_min_cap'] } }
        // },
        {
          $match: filterQuery
        },
        {
          $match: {
            $or: searchQuery
          }
        }
      ])
      .then(async itemOnCube => {
        belowMinItems = []
        console.log(itemOnCube)
        if (itemOnCube.length > 0) {
          for await (let item of itemOnCube) {
            var itemShortage = item.draw_doc[0].item_max_cap - item.quantity
            itemList = await JSON.parse(JSON.stringify(item))
            itemList['stock_shortage'] = itemShortage
            await belowMinItems.push(itemList)
          }
        }
        res.status(200).send({ success: true, data: belowMinItems })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}
exports.orderReport = (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false

  var searchString = req.query.searchString // Search Query

  var createdDateFrom = req.query.createdDateFrom // Direct Query
  var createdDateTo = req.query.createdDateTo // Direct Query
  var receivedDateFrom = req.query.receivedDateFrom // Direct Query
  var receivedDateTo = req.query.receivedDateTo // Direct Query
  var status = req.query.status // Direct Query
  var supplier_id = req.query.supplier_id // Direct Query
  var directQuery = {
    company_id: ObjectId(req.query.company_id),
    active_status: 1
  }
  var filterQuery = { active_status: 1 }
  var searchQuery = [{}]

  // Aggregation Queries

  // Direct Queries
  if (createdDateFrom) {
    var fromDate = moment(createdDateFrom).format('YYYY-MM-DD 00:00:00')
    var toDate = moment(createdDateTo).format('YYYY-MM-DD 23:59:59')
    directQuery['created_at'] = {
      $gt: new Date(fromDate),
      $lt: new Date(toDate)
    }
  }
  if (receivedDateFrom) {
    var fromDate = moment(receivedDateFrom).format('YYYY-MM-DD 00:00:00')
    var toDate = moment(receivedDateTo).format('YYYY-MM-DD 23:59:59')
    directQuery['received_date'] = {
      $gt: new Date(fromDate),
      $lt: new Date(toDate)
    }
  }
  if (supplier_id) {
    directQuery['supplier_id'] = ObjectId(supplier_id)
  }
  if (status) {
    directQuery['is_received'] = parseInt(status)
  }
  // Direct Queries

  if (searchString) {
    //Convert number into string
    inProgess = 'InProgress'
    sent = 'sent'
    received = 'Received'
    if (inProgess.includes(searchString)) directQuery['status'] = 0
    else if (sent.includes(searchString)) directQuery['status'] = 1
    else if (received.includes(searchString)) directQuery['status'] = 2
    else {
      searchQuery = [
        {
          'supplier_doc.supplier_name': { $regex: searchString }
        },
        {
          'item_doc.item_name': { $regex: searchString }
        }
      ]
    }
  }
  console.log(directQuery)
  console.log(searchQuery)

  // Aggregation Queries

  try {
    purchaseOrderModel
      .aggregate([
        {
          $match: {
            $and: [directQuery]
          }
        },
        { $sort: { created_at: -1 } },
        { $skip: offset },
        { $limit: limit },
        {
          $lookup: {
            from: 'suppliers',
            localField: 'supplier_id',
            foreignField: '_id',
            as: 'supplier_doc'
          }
        },
        {
          $lookup: {
            from: 'items',
            localField: 'item_id',
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
      .then(async order => {
        res.status(200).send({ success: true, data: order })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}
exports.kittingReport = async (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
  var company_id = req.query.company_id
  var searchString = req.query.searchString
  var category_id = req.query.category_id
  var sub_category_id = req.query.sub_category_id
  var query = searchString
    ? {
        active_status: 1,
        company_id: company_id,
        $text: { $search: searchString }
      }
    : { active_status: 1, company_id: company_id }
  if (category_id)
    query['kit_data'] = { $elemMatch: { category_id: category_id } }
  if (sub_category_id)
    query['kit_data'] = { $elemMatch: { sub_category_id: sub_category_id } }

  kit_details = []
  try {
    kitModel
      .find(query)
      .populate('kit_data.item_id')
      .populate('kit_data.sub_category_id')
      .populate('kit_data.category_id')
      .skip(offset)
      .limit(limit)
      .sort({ created_at: -1 })
      .then(async kits => {
        res.status(200).send({ success: true, data: await kits })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}
exports.usageReport = async (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
  var dateFrom = req.query.dateFrom // Direct Query
  var dateTo = req.query.dateTo // Direct Query
  var searchString = req.query.searchString
  var company_id = req.query.company_id
  var fromDate = moment(dateFrom).format('YYYY-MM-DD 00:00:00')
  var toDate = moment(dateTo).format('YYYY-MM-DD 23:59:59')
  var query = searchString
    ? {
        active_status: 1,
        company_id: company_id,
        $text: { $search: searchString }
        // updated_at: {
        //   $gt: new Date(fromDate),
        //   $lt: new Date(toDate)
        // }
      }
    : {
        active_status: 1,
        company_id: company_id
        // updated_at: {
        //   $gt: new Date(fromDate),
        //   $lt: new Date(toDate)
        // }
      }
  // // if (dateFrom) {

  // query.updated_at = {
  //   $gt: new Date(fromDate),
  //   $lt: new Date(toDate)
  // }
  // }
  console.log(query)
  stockItems = await stockAllocationModel.distinct('item', query).exec()
  totalUsageReport = []
  for await (let item of stockItems) {
    isItemNonReturnable = await itemModel.findOne({
      _id: item,
      returnable: false
    })
    if (isItemNonReturnable) {
      // Get Item Added on cube
      stockAlloted_item = await stockAllocationModel
        .distinct('_id', {
          item: item
          // updated_at: {
          //   $gt: new Date(fromDate),
          //   $lt: new Date(toDate)
          // }
        })
        .exec()
      itemAdded = await logModel.aggregate([
        {
          $match: {
            $and: [
              {
                action: 'Item added on cube',
                stock_allocation_id: { $in: stockAlloted_item },
                updated_at: {
                  $gt: new Date(fromDate),
                  $lt: new Date(toDate)
                }
              }
            ]
          }
        },
        { $group: { _id: null, trasaction_qty: { $sum: '$trasaction_qty' } } }
      ])
      console.log(itemAdded)
      // Get Item Added on cube for month
      itemTaken = await logModel.aggregate([
        {
          $match: {
            $and: [
              {
                action: 'Taken',
                stock_allocation_id: { $in: stockAlloted_item },
                updated_at: {
                  $gt: new Date(fromDate),
                  $lt: new Date(toDate)
                }
              }
            ]
          }
        },
        { $group: { _id: null, trasaction_qty: { $sum: '$trasaction_qty' } } }
      ])
      console.log('itemTaken')
      itemDetail = await stockAllocationModel
        .findOne({ item: item })
        .populate('item')
        .populate('cube')
        .exec()

      console.log('itemDetail')
      if (itemTaken.length > 0 && itemAdded.length > 0) {
        console.log('********** if block **************')
        item_usage = JSON.parse(JSON.stringify(itemDetail))
        item_usage['item_alloted'] = itemAdded[0].trasaction_qty
        item_usage['item_taken'] = itemTaken[0].trasaction_qty
        item_usage['item_usage'] =
          (itemTaken[0].trasaction_qty / itemAdded[0].trasaction_qty) * 100
        await totalUsageReport.push(item_usage)
        console.log('item_usage')
      }
    }
  }
  res.status(200).send({ success: true, item: totalUsageReport })
}

// Add Remaing Item Quantity at every first date of the month
async function addRemainingItemQty () {
  try {
    stockAlloted_item = await stockAllocationModel.find().exec()
    logData = []
    for await (let item of stockAlloted_item) {
      let data = {}
      data['module_name'] = 'Item added on cube'
      data['action'] = 'Item added on cube'
      data['stock_allocation_id'] = item._id
      data['trasaction_qty'] = item.quantity
      data['company_id'] = item.company_id
      logData.push(data)
    }
    await logModel.insertMany(logData)
  } catch (error) {
    console.log(error)
  }
}

// Auto Add Remaing Item in Log
var jobId = crontab.scheduleJob('1 1 1 * *', async function () {
  console.log('*********** Cron Schedule Started ***********')
  await addRemainingItemQty()
  console.log('*********** Auto Item Added On Log ***********')
})

async function calculatDate (subtractDay) {
  var d = new Date()
  await d.setDate(d.getDate() - subtractDay)
  var date = await d.toISOString().slice(0, 10)
  return date
}

exports.earlyWarningReport = async (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : 20

  var searchString = req.query.searchString // Search Query
  var cubeId = req.query.cube // Direct Query
  var columnId = req.query.columnId // Direct Query

  var directQuery = { company_id: ObjectId(req.query.company_id) }
  var filterQuery = {}
  var searchQuery = [{}]

  // Aggregation Queries

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
        'item_doc.quantity': parseInt(searchString)
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
        { $sort: { created_at: -1 } },
        { $skip: offset },
        { $limit: limit },
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

        // {
        //   $match: { $expr: { $lte: ['$quantity', '$draw_doc.item_min_cap'] } }
        // },
        {
          $match: filterQuery
        },
        {
          $match: {
            $or: searchQuery
          }
        }
      ])
      .then(async itemOnCube => {
        belowMinItems = []
        if (itemOnCube.length > 0) {
          for await (let item of itemOnCube) {
            if (
              item.quantity <= item.draw_doc[0].item_min_cap &&
              item.item_doc[0].returnable == false
            ) {
              await belowMinItems.push(item)
            }
          }
        }
        res.status(200).send({ success: true, data: belowMinItems })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.userSearch = async (req, res) => {
  searchString = req.query.searchString
  try {
    stockAllocationModel
      .aggregate([
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
          $match: {
            $and: [
              { 'cube_doc.employee_status': true },
              { 'draw_doc.is_removed': false },
              { 'column_doc.is_removed': false }
            ]
          }
        },
        {
          $lookup: {
            from: 'items',
            localField: 'item',
            foreignField: '_id',
            as: 'item_doc'
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'item_doc.category_id',
            foreignField: '_id',
            as: 'category_doc'
          }
        },
        {
          $lookup: {
            from: 'subcategories',
            localField: 'item_doc.sub_category_id',
            foreignField: '_id',
            as: 'sub_category_doc'
          }
        },
        {
          $match: {
            $or: [
              { 'category_doc.category_name': { $regex: searchString } },
              {
                'sub_category_doc.sub_category_name': { $regex: searchString }
              },
              { 'item_doc.item_name': { $regex: searchString } }
            ]
          }
        }
      ])
      .then(async result => {
        res.status(200).send({ success: true, data: result })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.cubeStockValue = async (req, res) => {
  try {
    var offset =
      req.query.offset != undefined ? parseInt(req.query.offset) : false
    var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
    var company_id = req.query.company_id
    var searchString = req.query.searchString
    var cube = req.query.cube_id
    var item = req.query.item_id
    var query = searchString
      ? {
          active_status: 1,
          company_id: company_id,
          $text: { $search: searchString }
        }
      : {
          active_status: 1,
          company_id: company_id
        }
    if (cube) {
      query['cube'] = cube
    }
    if (item) {
      query['item'] = item
    }
    stockAllocationModel
      .find(query)
      .select([
        '-bin',
        '-compartment',
        '-supplier',
        '-deleted_at',
        '-active_status',
        '-status',
        '-created_at',
        '-updated_at',
        '-__v',
        '-description',
        '-compartment_number'
      ])
      .populate({
        path: 'category',
        select: ['category_name']
      })
      .populate({
        path: 'sub_category',
        select: ['sub_category_name']
      })
      .populate({
        path: 'cube',
        select: ['cube_name']
      })
      .populate({
        path: 'item',
        select: ['item_name']
      })
      .populate('po_history.po_id', ['_id', 'price_per_qty'])
      .skip(offset)
      .limit(limit)
      .then(async stockItems => {
        // console.log(stockItems)
        totalStockItems = []
        for await (let cube of stockItems) {
          if (cube.po_history.length > 0) {
            console.log(cube.po_history.length)
            var poHistoryList = 0
            var isCurrentStockEqualsToLastAllocation = false
            var remainingQtyFromPreviousPo = cube.quantity // Each Purchase Order Allocated Qty 7
            allPoPriceInsideCube = []

            while (
              !isCurrentStockEqualsToLastAllocation &&
              cube.po_history.length > poHistoryList
            ) {
              console.log('While loop .......')
              let purchasePrice =
                cube.po_history[poHistoryList]['po_id'].price_per_qty
              let allocatedQtyFromPo =
                cube.po_history[poHistoryList].allocated_qty // Each Purchase Order Allocated Qty
              console.log(cube._id)
              console.log(cube.item.item_name)
              console.log(purchasePrice)
              console.log(allocatedQtyFromPo)
              console.log(remainingQtyFromPreviousPo)
              // Check If the Last Allocated item is lesser than curren avilability in the cube
              if (remainingQtyFromPreviousPo <= allocatedQtyFromPo) {
                price = remainingQtyFromPreviousPo * purchasePrice
                await allPoPriceInsideCube.push(price)
                isCurrentStockEqualsToLastAllocation = true
              } else {
                price = allocatedQtyFromPo * purchasePrice
                await allPoPriceInsideCube.push(price)
                remainingQtyFromPreviousPo =
                  remainingQtyFromPreviousPo - allocatedQtyFromPo
              }
              poHistoryList++
            }
            cubeStringyfy = JSON.parse(JSON.stringify(cube))
            totalCostForAllStock = allPoPriceInsideCube.reduce(function (a, b) {
              return a + b
            }, 0)
            cubeStringyfy['total_purchase_price'] = totalCostForAllStock
            await totalStockItems.push(cubeStringyfy)
          } else {
            cubeStringyfy = JSON.parse(JSON.stringify(cube))
            cubeStringyfy['total_purchase_price'] = 0
            await totalStockItems.push(cubeStringyfy)
          }
        }
        totalGroupedCubes = await groupCubes(totalStockItems)
        res.status(200).send({ success: true, data: totalGroupedCubes })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    console.log(error)
  }
}

async function groupCubes (arr) {
  let result = [
    ...arr
      .reduce((r, o) => {
        const key = o.item._id + '-' + o.cube._id

        const item =
          r.get(key) ||
          Object.assign({}, o, {
            quantity: 0,
            total_purchase_price: 0
          })

        item.quantity += o.quantity
        item.total_purchase_price += o.total_purchase_price

        return r.set(key, item)
      }, new Map())
      .values()
  ]
  // let resultOmit = _.omit(result, ['_id','category']);
  return result
}

exports.userUtilizationValueReport = async (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
  var dateFrom = req.query.dateFrom // Direct Query
  var dateTo = req.query.dateTo // Direct Query
  var user_id = req.query.user_id
  var item_id = req.query.item_id
  var searchString = req.query.searchString
  var company_id = req.query.company_id
  try {
    var query = searchString
      ? {
          active_status: 1,
          company_id: company_id,
          action: 'Taken',
          $text: { $search: searchString }
        }
      : { active_status: 1, company_id: company_id, action: 'Taken' }
    if (dateFrom) {
      var fromDate = moment(dateFrom).format('YYYY-MM-DD 00:00:00')
      var toDate = moment(dateTo).format('YYYY-MM-DD 23:59:59')
      query['created_at'] = {
        $gt: new Date(fromDate),
        $lt: new Date(toDate)
      }
    } else {
      var d = new Date()
      var fromDate = moment(d.setDate(d.getDate() - 150)).format(
        'YYYY-MM-DD 00:00:00'
      )
      var d2 = new Date()

      var toDate = moment(d2.setDate(d.getDate() + 1)).format(
        'YYYY-MM-DD 23:59:59'
      )
      query['created_at'] = {
        $gt: new Date(fromDate),
        $lt: new Date(toDate)
      }
    }
    if (user_id) {
      query['user_id'] = user_id
    }
    if (item_id) {
      query['item_id'] = item_id
    }

    console.log(query)
    logModel
      .find(query)
      .populate({
        path: 'item_id',
        select: ['_id', 'item_name', 'returnable']
      })
      .populate({
        path: 'user_id',
        select: ['_id', 'first_name', 'last_name']
      })
      .populate('po_history.po_id', ['_id', 'price_per_qty'])
      .skip(offset)
      .limit(limit)
      .then(async logs => {
        totalUserUtilization = []
        // Loop Each Po History
        for await (let log of logs) {
          if (!_.isEmpty(log.item_id)) {
            if (log.item_id.returnable == false && log.po_history.length > 0) {
              var totalPoPurchasePrice = 0 // add purchase price for each po order loop
              var totalTakenQty = 0 // add taken quantity for each po order loop
              // Loop Each PO Data and Multiply  price_per_qty and taken_qty
              for await (let poHistory of log.po_history) {
                // totalPrice = item po price x item taken quantity
                totalPoPurchasePrice =
                  poHistory.po_id.price_per_qty * poHistory.used_item_qty +
                  totalPoPurchasePrice
                totalTakenQty = totalTakenQty + poHistory.used_item_qty
              }
              logStringyfy = JSON.parse(JSON.stringify(log))
              logStringyfy['total_price_value'] = totalPoPurchasePrice
              logStringyfy['total_taken_qty'] = totalTakenQty
              await totalUserUtilization.push(logStringyfy)
            }
          }
        }
        groupByDateReport = await groupByDates(totalUserUtilization)
        res.status(200).send({ success: true, data: groupByDateReport })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    console.log(error)
  }
}

async function groupByDates (arr) {
  let result = [
    ...arr
      .reduce((r, o) => {
        const key =
          moment(o.created_at).format('YYYY-MM-DD 00:00:00') + '-' + o.user_id
        const item =
          r.get(key) ||
          Object.assign({}, o, {
            total_price_value: 0,
            total_taken_qty: 0
          })

        item.total_price_value += o.total_price_value
        item.total_taken_qty += o.total_taken_qty

        return r.set(key, item)
      }, new Map())
      .values()
  ]
  return result
}
