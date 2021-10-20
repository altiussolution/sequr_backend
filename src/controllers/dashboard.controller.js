
const { UserModel,branchModel,itemModel,categoryModel,subCategoryModel,rolesModel,binModel,compartmentModel,cubeModel,stockAllocationModel,departmentModel,supplierModel,purchaseOrderModel,kitModel} = require("../models");
const { User } = require("../models/user.model");
var {error_code} = require('../utils/enum.utils')


exports.getUsercount = (async (req, res) => {
    var query = ( { active_status: 1})
    try {
       await User.count(query).then(user => {
           // console.log(user)
            res.status(200).send({ success: true, data: user});
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
})

exports.getBranchcount = (async (req, res) => {
    var query = ( { active_status: 1})
    try {
       await branchModel.count(query).then(branch => {
           // console.log(branch)
            res.status(200).send({ success: true, data: branch});
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
})

exports.getItemcount = (async (req, res) => {
    var query = ( { active_status: 1})
    try {
       await itemModel.count(query).then(items => {
            console.log(items)
            res.status(200).send({ success: true, data: items});
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
})

exports.getCategorycount = (async (req, res) => {
    var query = ( { active_status: 1})
    try {
       await categoryModel.count(query).then(category => {
            console.log(category)
            res.status(200).send({ success: true, data: category});
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
})

exports.getsubCategorycount = (async (req, res) => {
    var query = ( { active_status: 1})
    try {
       await subCategoryModel.count(query).then(subCategory => {
            console.log(subCategory)
            res.status(200).send({ success: true, data: subCategory});
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
})

exports.getRolescount = (async (req, res) => {
    var query = ( { active_status: 1})
    try {
       await rolesModel.count(query).then(roles => {
            console.log(roles)
            res.status(200).send({ success: true, data: roles});
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
})

exports.getstockAllocationcount = (async (req, res) => {
    var query = ( { active_status: 1})
    try {
       await stockAllocationModel.count(query).then(stockAllocation => {
            console.log(stockAllocation)
            res.status(200).send({ success: true, data: stockAllocation});
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
})

exports.getBincount = (async (req, res) => {
    var query = ( { active_status: 1})
    try {
       await binModel.count(query).then(bin => {
            console.log(bin)
            res.status(200).send({ success: true, data: bin});
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
})

exports.getCompartmentcount = (async (req, res) => {
    var query = ( { active_status: 1})
    try {
       await compartmentModel.count(query).then(compartment => {
            console.log(compartment)
            res.status(200).send({ success: true, data: compartment});
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
})

exports.getKitcount = (async (req, res) => {
    var query = ( { active_status: 1})
    try {
       await kitModel.count(query).then(kit => {
            console.log(kit)
            res.status(200).send({ success: true, data: kit});
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
})

exports.getSuppliercount = (async (req, res) => {
    var query = ( { active_status: 1})
    try {
       await supplierModel.count(query).then(supplier => {
            console.log(supplier)
            res.status(200).send({ success: true, data: supplier});
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
})

exports.getCubecount = (async (req, res) => {
    var query = ( { active_status: 1})
    try {
       await cubeModel.count(query).then(cube => {
            console.log(cube)
            res.status(200).send({ success: true, data: cube});
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
})

exports.getDepartmentcount = (async (req, res) => {
    var query = ( { active_status: 1})
    try {
       await departmentModel.count(query).then(department => {
            console.log(department)
            res.status(200).send({ success: true, data: department});
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
})

exports.getPurchaseOrdercount = (async (req, res) => {
    var query = ( { active_status: 1})
    try {
       await purchaseOrderModel.count(query).then(purchaseOrder => {
            console.log(purchaseOrder)
            res.status(200).send({ success: true, data: purchaseOrder});
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
})