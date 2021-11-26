const {
  itemModel,
  cubeModel,
  binModel,
  stockAllocationModel
} = require('../models')
var ObjectId = require('mongodb').ObjectID

exports.columnShortage = async (req, res) => {
  var branch_id = req.query.branch_id
  var query = branch_id
    ? { active_status: 1, branch: req.query.branch_id, company_id: company_id }
    : { active_status: 1, company_id: company_id }
  try {
    cubes = await cubeModel
      .find({
        query
      })
      .exec()

    overallShortageReport = []
    for await (let cube of cubes) {
      eachCube = {}
      activeColumns = await binModel
        .find({
          cube_id: cube._id,
          active_status: 1,
          is_removed: false
        })
        .exec()
      removedBinCount = await binModel
        .find({
          cube_id: cube._id,
          active_status: 1,
          is_removed: true
        })
        .exec()
      eachCube['cube'] = cube
      eachCube['active_columns'] = activeColumns
      eachCube['removed_columns'] = removedBinCount
      await overallShortageReport.push(eachCube)
    }
    res.status(200).send({ success: true, data: overallShortageReport })
  } catch (error) {
    res.status(201).send(error.name)
  }
}
exports.itemShortage = async (req, res) => {
  console.log(req.query.branch_id)
  var company_id = req.query.company_id
  var filterBranch = req.query.branch_id
    ? {
        $match: {
          'cube_doc.branch_id': ObjectId(req.query.branch_id),
          'cube_doc.active_status': 1,
          'item_doc.active_status': 1,
          'draw_doc.active_status': 1
        }
      }
    : {
        $match: {
          'item_doc.active_status': 1,
          'draw_doc.active_status': 1,
          'cube_doc.active_status': 1
        }
      }
  // try {
  itemOnCube = await stockAllocationModel
    .aggregate([
      {
        $match: { company_id: ObjectId(company_id) }
      },
      {
        $group: {
          _id: '$item',
          item: { $push: '$item' },
          compartment: { $push: '$compartment' },
          cube: { $push: '$cube' },
          available: { $sum: '$quantity' },
          total_quantity: { $sum: '$total_quantity' }
        }
      },

      {
        $lookup: {
          from: 'items',
          localField: 'item',
          foreignField: '_id',
          as: 'item_doc'
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
          from: 'cubes',
          localField: 'cube',
          foreignField: '_id',
          as: 'cube_doc'
        }
      },
      filterBranch
    ])
    .exec()

  //   itemOnCube2 = await itemModel.populate(itemOnCube, { path: 'item' }).exec()
  //   console.log(itemOnCube2)
  res.status(200).send({ success: true, data: itemOnCube })
  // } catch (error) {
  //   res.status(201).send(error.name)
  // }
}

exports.purchaseOrder = (req, res) => {}
