const {
  UserModel,
  branchModel,
  itemModel,
  categoryModel,
  subCategoryModel,
  rolesModel,
  binModel,
  compartmentModel,
  cubeModel,
  stockAllocationModel,
  departmentModel,
  supplierModel,
  purchaseOrderModel,
  kitModel,
  shift_timeModel,
  machineUsageModel
} = require('../models')
const { User } = require('../models/user.model')
var { error_code } = require('../utils/enum.utils')
// const { createLog } = require('../middleware/crud.middleware')

exports.getUsercount = async (req, res) => {
  var company_id = req.query.company_id
  customerRole = await rolesModel.distinct('_id', {
    role_id: { $in: ['$ SEQUR SUPERADMIN $', '$ SEQUR CUSTOMER $'] }
  }).exec()
  var query = { active_status: 1 ,company_id : company_id,role_id : { $nin: customerRole }}
  try {
    await User.count(query)
      .then(user => {
        // console.log(user)
        res.status(200).send({ success: true, data: user })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.getBranchcount = async (req, res) => {
  var company_id = req.query.company_id
  var query = { active_status: 1 ,company_id:company_id}
  try {
    await branchModel
      .count(query)
      .then(branch => {
        // console.log(branch)
        res.status(200).send({ success: true, data: branch })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.getItemcount = async (req, res) => {
  var company_id = req.query.company_id
  var query = { active_status: 1, company_id:company_id }
  try {
    await itemModel
      .count(query)
      .then(items => {
        console.log(items)
        res.status(200).send({ success: true, data: items })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.getCategorycount = async (req, res) => {
  var company_id = req.query.company_id
  var query = { active_status: 1,company_id:company_id }
  try {
    await categoryModel
      .count(query)
      .then(category => {
        console.log(category)
        res.status(200).send({ success: true, data: category })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.getsubCategorycount = async (req, res) => {
  var company_id = req.query.company_id
  var categoryId = req.query.category_id
  var query = { active_status: 1 ,company_id:company_id, category_id: categoryId}
  try {
    await subCategoryModel
      .count(query)
      .then(subCategory => {
        console.log(subCategory)
        res.status(200).send({ success: true, data: subCategory })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.getRolescount = async (req, res) => {
  var company_id = req.query.company_id
  var query = { active_status: 1 ,company_id:company_id}
  try {
    await rolesModel
      .count(query)
      .then(roles => {
        console.log(roles)
        res.status(200).send({ success: true, data: roles })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.getstockAllocationcount = async (req, res) => {
  var company_id = req.query.company_id
  var query = { active_status: 1 ,company_id:company_id}
  try {
    await stockAllocationModel
      .count(query)
      .then(stockAllocation => {
        console.log(stockAllocation)
        res.status(200).send({ success: true, data: stockAllocation })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.getBincount = async (req, res) => {
  var company_id = req.query.company_id
  var query = { active_status: 1 ,company_id:company_id}
  try {
    await binModel
      .count(query)
      .then(bin => {
        console.log(bin)
        res.status(200).send({ success: true, data: bin })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.getCompartmentcount = async (req, res) => {
  var company_id = req.query.company_id
  var query = { active_status: 1,company_id:company_id }
  try {
    await compartmentModel
      .count(query)
      .then(compartment => {
        console.log(compartment)
        res.status(200).send({ success: true, data: compartment })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.getKitcount = async (req, res) => {
  var company_id = req.query.company_id
  var query = { active_status: 1,company_id:company_id }
  try {
    await kitModel
      .count(query)
      .then(kit => {
        console.log(kit)
        res.status(200).send({ success: true, data: kit })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.getSuppliercount = async (req, res) => {
  var company_id = req.query.company_id
  var query = { active_status: 1,company_id:company_id }
  try {
    await supplierModel
      .count(query)
      .then(supplier => {
        console.log(supplier)
        res.status(200).send({ success: true, data: supplier })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.getCubecount = async (req, res) => {
  var company_id = req.query.company_id
  var query = { active_status: 1 ,company_id:company_id}
  try {
    await cubeModel
      .count(query)
      .then(cube => {
        console.log(cube)
        res.status(200).send({ success: true, data: cube })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.getDepartmentcount = async (req, res) => {
  var company_id = req.query.company_id
  var query = { active_status: 1 ,company_id:company_id}
  try {
    await departmentModel
      .count(query)
      .then(department => {
        console.log(department)
        res.status(200).send({ success: true, data: department })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.getPurchaseOrdercount = async (req, res) => {
  var company_id = req.query.company_id
  var query = { active_status: 1 ,company_id:company_id}
  try {
    await purchaseOrderModel
      .count(query)
      .then(purchaseOrder => {
        console.log(purchaseOrder)
        res.status(200).send({ success: true, data: purchaseOrder })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.getPermissioncount = async (req, res) => {
  var company_id = req.query.company_id
  var query = { active_status: 1, company_id:company_id, $where: "this.permission.length > 1"}
  try {
    await rolesModel
      .count(query)
      .then(roles => {
        console.log(roles)
        res.status(200).send({ success: true, data: roles })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.getshiftTimecount = async (req, res) => {
  var company_id = req.query.company_id
  var query = { active_status: 1 ,company_id:company_id}
  try {
    await shift_timeModel
      .count(query)
      .then(shift_time => {
        console.log(shift_time)
        res.status(200).send({ success: true, data: shift_time })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.addMachineUsage = async (req, res) => {
  try {
    data = req.body
    console.log(data)
    machineUsage = []
    for await (let cube of data) {
      let eachMachineUsage = {}
      bin = await binModel.findOne({ bin_id: cube.column_id }).exec()
      eachMachineUsage['cube_id'] = bin.cube_id
      eachMachineUsage['bin_id'] = bin._id
      eachMachineUsage['machine_usage'] = cube.column_usage
      eachMachineUsage['company_id'] = cube.company_id
      machineUsage.push(eachMachineUsage)
    }

    machineUsageModel.insertMany(machineUsage).then(async machineUsage => {
      console.log(machineUsage)
      res
        .status(200)
        .send({ success: true, message: 'Machine Usage Created Successfully!' })
      // createLog(req.headers['authorization'], 'Columns', 2)
    })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

var ObjectId = require('mongodb').ObjectID

exports.getMachineUsage = async (req, res) => {
  var company_id = req.query.company_id
  var query = req.query.branch_id
    ? { active_status: 1, branch: req.query.branch_id ,company_id:company_id}
    : { active_status: 1 ,company_id:company_id}
  try {
    cubes = await cubeModel
      .find({
        query
      })
      .exec()

    // Usage Between today and 7 day before
    today = new Date()
    sevenDayBefore = new Date()
    var dateOffset = 24 * 60 * 60 * 1000 * 7 //7 days
    sevenDayBefore.setTime(sevenDayBefore.getTime() - dateOffset)
    console.log(today)
    console.log(sevenDayBefore)
    oveallmachineUsage = []
    for await (let cube of cubes) {
      let eachCubeUsage = {}
      cubeUsage = await machineUsageModel
        .aggregate([
          {
            $match: {
              $and: [
                { cube_id: cube._id },
                { created_at: { $gt: new Date(sevenDayBefore) } },
                { created_at: { $lt: new Date(today) } }
              ]
            }
          },
          { $group: { _id: null, sum: { $sum: '$machine_usage' } } }
        ])
        .sort({ created_at: 1 })
        .exec()
      // .sort({ created_at: 1 })

      eachCubeUsage[cube.cube_name] = {}
      eachCubeUsage[cube.cube_name]['cube_id'] = cube.cube_id
      if (cubeUsage.length > 0) {
        eachCubeUsage[cube.cube_name]['cube_usage'] = cubeUsage[0].sum
      } else {
        eachCubeUsage[cube.cube_name]['cube_usage'] = 0
      }
      bins = await binModel
        .find({
          active_status: 1
        })
        .exec()
      eachCubeUsage[cube.cube_name]['columns'] = []
      for await (let bin of bins) {
        let eachBin = {}

        binUsage = await machineUsageModel
          .aggregate([
            {
              $match: {
                $and: [
                  { bin_id: bin._id },
                  { created_at: { $gt: new Date(sevenDayBefore) } },
                  { created_at: { $lt: new Date(today) } }
                ]
              }
            },
            { $group: { _id: null, sum: { $sum: '$machine_usage' } } }
          ])
          .exec()
        eachBin['column_id'] = bin.bin_id
        eachBin['column_name'] = bin.bin_name
        if (binUsage.length > 0) {
          eachBin['column_usage'] = binUsage[0].sum
        } else {
          eachBin['column_usage'] = 0
        }
        await eachCubeUsage[cube.cube_name]['columns'].push(eachBin)
      }
      await oveallmachineUsage.push(eachCubeUsage)
    }
    res.status(200).send({ success: true, data: oveallmachineUsage })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.itemAlert = async (req, res) => {
  try {
    itemOnCube = await stockAllocationModel
      .aggregate([
        {
          $group: {
            _id: '$item',
            company_id : '$company_id',
            compartment: { $push: '$compartment' },
            item: { $push: '$item' },
            available: { $sum: '$quantity' },
            total_quantity: { $sum: '$total_quantity' }
          }
        },

        {
          $lookup: {
            from: 'compartments',
            localField: 'compartment',
            foreignField: '_id',
            as: 'draw_doc'
          }
        },
        {
          $lookup: {
            from: 'items',
            localField: 'item',
            foreignField: '_id',
            as: 'item_doc'
          }
        }
        //   {
        //     $match: {
        //      available: '$available',
        //     }
        // }
      ])
      .exec()

    outOfStockItems = []
    for await (let item of itemOnCube) {
      console.log(item)
      console.log(item.available + '   ' + item.draw_doc.item_min_cap)
      if (
        item.available <= item.draw_doc[0].alert_on
      ) {
        await outOfStockItems.push(item)
      }
    }

    //   itemOnCube2 = await itemModel.populate(itemOnCube, { path: 'item' }).exec()
    //   console.log(itemOnCube2)
    res.status(200).send({ success: true, data: outOfStockItems })
  } catch (error) {
    res.status(201).send(error.name)
  }
}

exports.calibrationMonthNotification = async (req, res) => {
  try {
    var company_id = req.query.company_id
    await itemModel
      .find({
        active_status: 1,
        company_id:company_id,
        is_gages: true,
        calibration_month: { $exists: true, $ne: null }
      })
      .then(async items => {
        if (items.length > 0) {
          notifyItems = []
          for await (let item of items) {
            today = new Date()
            calibration_month = new Date(item.calibration_month)
            if (calibration_month < today) {
              var isFuture = true
            } else {
              var diffDate = parseInt(
                (item.calibration_month - new Date()) / (1000 * 60 * 60 * 24),
                10
              )
            }
            console.log(calibration_month)
            console.log(today)
            console.log(isFuture)
            console.log(diffDate)
            if (isFuture) {
              await notifyItems.push(item)
            } else if (diffDate <= 3) {
              await notifyItems.push(item)
            }
          }
          res.status(200).send({ success: true, data: notifyItems })
        }
      })
  } catch (error) {
    res.status(201).send(error.name)
  }
}
exports.outOfStockItems = async (req, res) => {
  try {
    var company_id = req.query.company_id
    await itemModel
      .find({
        active_status: 1,
        company_id:company_id,
        returnable: false,
        $where: 'this.generate_po_on >= this.in_stock'
      })
      .then(async items => {
        res.status(200).send({ success: true, data: items })
      })
  } catch (error) {
    res.status(201).send(error.name)
  }
}

exports.getForgotpassword = async (req, res) => {
  var company_id = req.query.company_id
  var query = { new_pass_req: true, active_status: 1 ,company_id:company_id}
  try {
    await User.find(query)
      .then(user => {
        console.log(user)
        res.status(200).send({ success: true, data: user })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.poAlert = (req, res) => {
  var company_id = req.query.company_id
  var query = { active_status: 1, is_received: 0, is_auto_po: true , company_id:company_id }
  try {
    purchaseOrderModel
      .find(query)
      .populate('item_id')
      .populate('sub_category_id')
      .then(purchaseOrder => {
        res.status(200).send({ success: true, data: purchaseOrder })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}
