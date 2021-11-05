const { binModel, cubeModel, machineUsageModel } = require('../models')

var moment = require('moment')

exports.cubeIdleHours = async (req, res) => {
  try {
    cubes = await cubeModel
      .find({
        active_status: 1
      })
      .exec()

    oveallmachineUsage = []
    day = 0
    while (day < 7) {
      dateForUsage = await calculatDate(day)
      endDay = moment(dateForUsage).format('YYYY-MM-DD 23:59:59')

      console.log(endDay)
      for await (let cube of cubes) {
        let eachCubeUsage = {}
        cubeUsage = await machineUsageModel
          .aggregate([
            {
              $match: {
                $and: [
                  { cube_id: cube._id },
                  { created_at: { $gt: new Date(dateForUsage) } },
                  {
                    created_at: {
                      $lt: new Date(endDay)
                    }
                  }
                ]
              }
            },
            { $group: { _id: null, sum: { $sum: '$machine_usage' } } }
          ])
          .exec()
        eachCubeUsage['date'] = dateForUsage
        eachCubeUsage['cube_id'] = cube.cube_id
        if (cubeUsage[0]) {
          eachCubeUsage['cube_usage'] = cubeUsage[0].sum
          eachCubeUsage['cube_idle'] = 8.64e7 - cubeUsage[0].sum
          8.64e7
        } else {
          eachCubeUsage['cube_usage'] = 0
          eachCubeUsage['cube_idle'] = 8.64e7
        }
        await oveallmachineUsage.push(eachCubeUsage)
      }
      day++
    }
    res.status(200).send({ success: true, data: oveallmachineUsage })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.filterCubeIdleHours = async (req, res) => {
  body = req.query

  Cubequery = {}
  machineUsageQuery = {}
  startDay = moment(body.date).format('YYYY-MM-DD 00:00:01')
  endDay = moment(body.date).format('YYYY-MM-DD 23:59:59')

//   try {
    cubes = await cubeModel
      .find({
        active_status: 1
      })
      .exec()

    oveallmachineUsage = []

    for await (let cube of cubes) {
      let eachCubeUsage = {}
      cubeUsage = await machineUsageModel
        .aggregate([
          {
            $match: {
              $and: [
                { cube_id: cube._id },
                { created_at: { $gt: new Date(startDay) } },
                {
                  created_at: {
                    $lt: new Date(endDay)
                  }
                }
              ]
            }
          },
          { $group: { _id: null, sum: { $sum: '$machine_usage' } } }
        ])
        .exec()
      eachCubeUsage['date'] = startDay
      eachCubeUsage['cube_id'] = cube.cube_id
      if (cubeUsage[0]) {
        eachCubeUsage['cube_usage'] = cubeUsage[0].sum
        eachCubeUsage['cube_idle'] = 8.64e7 - cubeUsage[0].sum
        8.64e7
      } else {
        eachCubeUsage['cube_usage'] = 0
        eachCubeUsage['cube_idle'] = 8.64e7
      }
      await oveallmachineUsage.push(eachCubeUsage)
    }

    res.status(200).send({ success: true, data: oveallmachineUsage })
//   } catch (error) {
//     res.status(201).send({ success: false, error: error })
//   }
}

async function calculatDate (subtractDay) {
  var d = new Date()
  await d.setDate(d.getDate() - subtractDay)
  var date = await d.toISOString().slice(0, 10)
  console.log(date)
  return date
}