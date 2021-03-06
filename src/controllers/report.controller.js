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
        $text: { $search: searchString },
        // updated_at: {
        //   $gt: new Date(fromDate),
        //   $lt: new Date(toDate)
        // }
      }
    : {
        active_status: 1,
        company_id: company_id,
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
          item: item,
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
        console.log("********** if block **************")
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
