const route = require('express').Router()
const { ReportController } = require('../controllers')

route.get('/transactionReport', ReportController.transactionReport)
route.get('/overallStockReport', ReportController.overallStockReport)
route.get('/deadStockReport', ReportController.deadStockReport)
route.get('/stockShortageReport', ReportController.stockShortageReport)
module.exports = route