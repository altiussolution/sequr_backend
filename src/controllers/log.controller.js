const { logModel, stockAllocationModel } = require('../models')

exports.getLog = (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
  var searchString = req.query.searchString
  var query = searchString
    ? {
        $text: { $search: searchString },
        stock_allocation_id: { $exists: false }
      }
    : { stock_allocation_id: { $exists: false } }
  try {
    logModel
      .find(query)
      .populate('user_id')
      .sort({ created_at: -1 })
      .skip(offset)
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

exports.getUserTakenQuantity = async (req, res) => {
  var fromDate = moment((new Date())).format('YYYY-MM-DD 00:00:00')
  var toDate = moment((new Date())).format('YYYY-MM-DD 23:59:59')
  query['created_at'] = {
    $gt: new Date(fromDate),
    $lt: new Date(toDate)
  }

  try {
    stockAlloted_item = await stockAllocationModel
      .distinct('_id', {
        item: req.query.item_id
      })
      .exec()

    itemTaken = await logModel.aggregate([
      {
        $match: {
          $and: [
            {
              action: 'Taken',
              user_id : req.query.user_id,
              stock_allocation_id: { $in: stockAlloted_item },
              created_at: query.created_at
            }
          ]
        }
      },
      { $group: { _id: null, trasaction_qty: { $sum: '$trasaction_qty' } } }
    ])
    res.status(200).send({ success: true, data: itemTaken })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}
