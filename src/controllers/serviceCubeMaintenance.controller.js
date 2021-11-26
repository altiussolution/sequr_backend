const { binModel, cubeModel, machineUsageModel } = require('../models')

var moment = require('moment')
const { application } = require('express')

exports.cubeIdleHours = async (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
  var company_id = req.query.company_id
  try {
    cubes = await cubeModel
      .find({
        active_status: 1,
        company_id: company_id
      })
      .populate('branch_id')
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
            { $sort: { created_at: -1 } },
            { $skip: offset },
            { $limit: limit },
            {
              $group: {
                _id: '$_id',
                sum: { $sum: '$machine_usage' },
                cube_id: { $push: '$cube_id' },
                bin_id: { $push: '$bin_id' }
              }
            },
            {
              $lookup: {
                from: 'cubes',
                localField: 'cube_id',
                foreignField: '_id',
                as: 'cube_doc'
              }
            },
            {
              $lookup: {
                from: 'bins',
                localField: 'bin_id',
                foreignField: '_id',
                as: 'bin_doc'
              }
            }
          ])
          .exec()
        eachCubeUsage['date'] = dateForUsage
        eachCubeUsage['cube'] = cube.cube_id
        eachCubeUsage['cube_name'] = cube.cube_name
        eachCubeUsage['branch'] = cube.branch_id
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
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
  var company_id = req.query.company_id
  Cubequery = {}
  machineUsageQuery = {}
  startDay = moment(body.date).format('YYYY-MM-DD 00:00:01')
  endDay = moment(body.date).format('YYYY-MM-DD 23:59:59')
  applicationStartDate = moment(new Date('2021-10-01')).format(
    'YYYY-MM-DD 23:59:59'
  )
  var today = moment(new Date()).format('YYYY-MM-DD 23:59:59')



  console.log('Filter Date _   ' + startDay)
  console.log('Sequre App Start Date _   ' + applicationStartDate)
  console.log('Today_  ' + today)

  // try {
  if (startDay > applicationStartDate && startDay < today) {
    cubes = await cubeModel
      .find({
        active_status: 1,
        company_id: company_id,
        branch_id: body.branch_id
      })
      .populate('branch_id')
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
          { $group: { _id: null, sum: { $sum: '$machine_usage' } } },
          { $sort: { created_at: -1 } }
          // { $skip: offset },
          // { $limit: limit }
        ])
        .exec()
      eachCubeUsage['date'] = startDay
      eachCubeUsage['cube_id'] = cube.cube_id
      eachCubeUsage['cube_name'] = cube.cube_name
      eachCubeUsage['branch'] = cube.branch_id

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
  } else {
    res.status(200).send({ success: false, data: [] })
  }
  // } catch (error) {
  //   res.status(201).send({ success: false, error: error })
  // }
}

async function calculatDate (subtractDay) {
  var d = new Date()
  await d.setDate(d.getDate() - subtractDay)
  var date = await d.toISOString().slice(0, 10)
  return date
}
