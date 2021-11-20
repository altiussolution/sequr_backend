const route = require('express').Router()
const { ReportController } = require('../controllers')

route.get('/transactionReport', ReportController.transactionReport)
route.get('/overallStockReport', ReportController.overallStockReport)
route.get('/deadStockReport', ReportController.deadStockReport)
route.get('/stockShortageReport', ReportController.stockShortageReport)
route.get('/orderReport', ReportController.orderReport)
route.get('/kittingReport', ReportController.kittingReport)
route.get('/usageReport', ReportController.usageReport)
module.exports = route