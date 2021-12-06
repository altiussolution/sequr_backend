const route = require('express').Router()
const { ReportController } = require('../controllers')
const auth = require('../middleware/auth.middleware')

route.get('/transactionReport', auth, ReportController.transactionReport)
route.get('/overallStockReport', auth, ReportController.overallStockReport)
route.get('/deadStockReport', auth, ReportController.deadStockReport)
route.get('/stockShortageReport', auth, ReportController.stockShortageReport)
route.get('/orderReport', auth, ReportController.orderReport)
route.get('/kittingReport', auth, ReportController.kittingReport)
route.get('/usageReport', auth, ReportController.usageReport)
route.get('/earlyWarningReport',auth, ReportController.earlyWarningReport)
route.get('/userSearch', ReportController.userSearch)
module.exports = route
