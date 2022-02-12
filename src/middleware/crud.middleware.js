const {
  categoryModel,
  subCategoryModel,
  itemModel,
  purchaseOrderModel,
  stockAllocationModel
} = require('../models')
const { logModel } = require('../models')
const jwt = require('jsonwebtoken')
const config = process.env

exports.createLog = (token, module_name, action, stock_id, qty, po_history, item_id, ) => {
  try {
    //Decode User Token
    const decoded = jwt.verify(token, config.TOKEN_KEY)
    // const decoded = {user_id : '61b1ec7e39ba9bf6bd290cea',company_id :  '61b1ec7e39ba9bf6bd290cea'}
    if (action == 0) var action = 'Deleted'
    else if (action == 1) var action = 'Updated'
    else if (action == 2) var action = 'Created'
    var data = !stock_id
      ? {
          user_id: decoded.user_id,
          module_name,
          action,
          company_id : decoded.company_id
        }
      : {
          user_id: decoded.user_id,
          company_id : decoded.company_id,
          module_name,
          action,
          stock_allocation_id: stock_id,
          trasaction_qty: qty,
          item_id : item_id,
          po_history : po_history,

        }

    //Save Logs
    var log = new logModel(data)
    log.save(err => {
      if (!err) {
        console.log('Log Created Successfully!')
      } else {
        console.log(err)
      }
    })
  } catch (error) {
    console.log('Something Went Wrong in Create Log')
  }
}
