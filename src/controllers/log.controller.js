const { logModel} = require('../models')


exports.getLog = (req, res) => {
    var offset =
      req.query.offset != undefined ? parseInt(req.query.offset) : false
    var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
    var searchString = req.query.searchString
    var company_id = req.query.company_id
    var query = searchString
      ? {$text: { $search: searchString}, stock_allocation_id: {$exists: false},company_id : company_id }
      : {stock_allocation_id: {$exists: false},company_id:company_id}
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