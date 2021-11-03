const { compartmentModel, cubeModel } = require('../models')

exports.columnShortage = async (req, res) => {
  cubes = await cubeModel
    .find({
      active_status: 1
    })
    .exec()

    overallShortageReport = []
  for await (let cube of cubes) {

  }
}

exports.itemShortage = (req, res) => {}

exports.purchaseOrder = (req, res) => {}
