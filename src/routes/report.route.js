const route = require('express').Router()
const { ReportController } = require('../controllers')

route.get('/getTransactionReport', ReportController.getTransactionReport)
module.exports = route