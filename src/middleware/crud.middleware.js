const {
  categoryModel,
  subCategoryModel,
  itemModel,
  purchaseOrderModel,
  stockAllocationModel
} = require('../models')
const { logModel } = require('../models')
const jwt = require('jsonwebtoken')
const config = process.env;

exports.createLog = (token, module_name, action) => {
//   try {
console.log(token)
console.log(token)
    //Decode User Token
    const decoded = jwt.verify(token, config.TOKEN_KEY)
    var data = { user_id : decoded.user_id, module_name, action }
    //Save Logs
    var log = new logModel(data)
    log.save(err => {
      if (!err) {
        console.log('Log Created Successfully!')
      } else {
        console.log('Log Not Created')
      }
    })
//   } catch (error) {
//     console.log('Something Went Wrong in Create Log')
//   }
}
