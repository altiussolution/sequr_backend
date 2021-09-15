const {stockAllocationModel} = require('../models')
exports.allocateStock = ((req,res) =>{
    var stock = new stockAllocationModel(req.body)
})