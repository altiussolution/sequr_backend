const route = require('express').Router()
const { ReportController } = require('../controllers')
const auth = require('../middleware/auth.middleware')

route.get('/transactionReport', auth, ReportController.transactionReport)
route.get('/overallStockReport', ReportController.overallStockReport)
route.get('/deadStockReport', auth, ReportController.deadStockReport)
route.get('/stockShortageReport', auth, ReportController.stockShortageReport)
route.get('/orderReport', auth, ReportController.orderReport)
route.get('/kittingReport', auth, ReportController.kittingReport)
route.get('/usageReport', auth, ReportController.usageReport)
route.get('/earlyWarningReport', auth, ReportController.earlyWarningReport)
route.get('/userSearch', auth, ReportController.userSearch)
route.get('/cubeStockValue', auth, ReportController.cubeStockValue)
route.get(
  '/userUtilizationValueReport',
  auth,
  ReportController.userUtilizationValueReport
)
module.exports = route
