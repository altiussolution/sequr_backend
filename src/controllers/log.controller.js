const { logModel} = require('../models')


exports.getLog = (req, res) => {
    var offset =
      req.query.offset != undefined ? parseInt(req.query.offset) : false
    var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
    var searchString = req.query.searchString
    var query = searchString
      ? {$text: { $search: searchString } }
      : {}
    try {
      logModel
        .find(query)
        .sort({ created_at: 1 })
        .populate('user_id')
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