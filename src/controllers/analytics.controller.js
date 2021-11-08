const {
  itemModel,
  cubeModel,
  binModel,
  stockAllocationModel
} = require('../models')

exports.columnShortage = async (req, res) => {
  try {
    cubes = await cubeModel
      .find({
        active_status: 1
      })
      .exec()

    overallShortageReport = []
    for await (let cube of cubes) {
      eachCube = {}
      totalBinCount = await binModel
        .find({
          cube_id: cube._id,
          active_status: 1
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
      eachCube['total_columns'] = totalBinCount
      eachCube['removed_columns'] = removedBinCount
      await overallShortageReport.push(eachCube)
    }
    res.status(200).send({ success: true, data: overallShortageReport })
  } catch (error) {
    res.status(201).send(error.name)
  }
}
exports.itemShortage = async (req, res) => {
    try {
  itemOnCube = await stockAllocationModel
    .aggregate([
      {
        $group: {
          _id: '$item',
          item: { $push: '$item' },
          compartment: { $push: '$compartment' },
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
      }
    ])
    .exec()

//   itemOnCube2 = await itemModel.populate(itemOnCube, { path: 'item' }).exec()
//   console.log(itemOnCube2)
  res.status(200).send({ success: true, data: itemOnCube })


    } catch (error) {
      res.status(201).send(error.name)
    }
}

exports.purchaseOrder = (req, res) => {}
