const { shift_timeModel } = require("../models");
const { createLog } = require('../middleware/crud.middleware')
var ObjectId = require('mongodb').ObjectID
const { ObjectID } = require('bson')

exports.addShift = (async (req, res) => {
        try {
            var newShift = new shift_timeModel(req.body);
            newShift.save(async (err) =>  {
                if (err) {
                    const start = await shift_timeModel.findOne(({start_time :req.body.start_time, active_status : 1})).exec()
                    const end = await shift_timeModel.findOne(({ end_time: req.body.end_time ,active_status : 1 })).exec()
                    if(start && end){
                        res.status(409).send({
                            success: false,
                            message: 'Shift start time & end time already exists'
                        });
                    } else if (start){
                        res.status(409).send({
                            success: false,
                            message: 'Shift start time already exists'
                        });
                    }else if (end){
                        res.status(409).send({
                            success: false,
                            message: 'Shift end time already exists'
                        });
                    }
                }
                else {
                    res.status(200).send({ success: true, message: 'Shift Time Added Successfully!' });
                    createLog(req.headers['authorization'], 'ShiftTime', 2)
                }
            });
        } catch (error) {
            res.send("An error occured");
            console.log(error);
        }
    })
exports.getShift = (async (req, res) => {
  var company_id = req.query.company_id
  console.log(req.query)
    try {
        shift_timeModel.find({ active_status: 1,company_id:company_id }, (err, shift) => {
            if (!err) {
                res.send({
                    status: 'Success',
                    shift: shift
                });
            }
            else {
                res.send(err.message);
            }
        })
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})

exports.updateShift = (async (req, res) => {
    try {
        shift_timeModel.findByIdAndUpdate(req.params.id, req.body, (err, file) => {
            if (!err)
                res.send({
                    status: 'Success',
                    message: 'shift updated'
                });
            else {
                res.send(err.message);
            }
            createLog(req.headers['authorization'], 'ShiftTime', 1)
        });
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})

exports.deleteShift= (req, res) => {
    try {
      shift_timeModel 
        .aggregate([
          {
            $match: {
              $and: [{ _id: ObjectId(req.params.id) }, { active_status: 1 }]
            }
          },
          {
            $lookup: {
              from: 'users', 
              localField: '_id',
              foreignField: 'shift_time_id',
              as: 'user_doc' 
            }
          }
        ])
        .then(async doc => {
         
          message = []
          if (doc[0].user_doc.length > 0) {
            await message.push(
              'Please delete all the refered users by this shifttime'
            )
          }
          if (message.length > 0) {
            res.status(200).send({ success: true, message: message })
          } else if (message.length == 0) {
            shift_timeModel
              .deleteOne({ _id: ObjectId(req.params.id), active_status: 1 })
              .then(shift_time => {
                res.status(200).send({
                  success: true,
                  message: 'Shift Deleted Successfully!'
                })
                createLog(req.headers['authorization'], 'ShiftTime', 0)
              })
              .catch(err => {
                res
                  .status(200)
                  .send({ success: false, message: 'ShiftTime Not Found' })
              })
  
          
          }
        })
        .catch(err => {
          res.status(200).send({ success: false, message: 'ShiftTime Not Found' })
        })
    } catch (err) {
      res
        .status(200)
        .send({ success: false, error: err, message: 'An Error Catched' })
    }
  }
// exports.deleteShift = (async (req, res) => {
//     try {
//         shift_timeModel.findByIdAndUpdate(req.params.id, { active_status: 0 }, (err, file) => {
//             if (!err)
//                 res.send({
//                     status: 'Success',
//                     message: 'shift deleted'
//                 });
//             else {
//                 res.send(err.message);
//             }
//             createLog(req.headers['authorization'], 'ShiftTime', 0)
//         });
//     } catch (error) {
//         res.send("An error occured");
//         console.log(error);
//     }
// })


exports.getShiftfilter =  (req, res) => {
    var shift_type = req.query.shift_type;
    var company_id = req.query.company_id;
   
    if( shift_type ){
        var query = { shift_type :shift_type }
    }
    if( shift_type && company_id){
      var query = { shift_type :shift_type, company_id : company_id }
  }
  if( company_id  ){
    var query = { company_id : company_id }
}
    try {
       shift_timeModel.find(query).then(shift_time => {
            res.status(200).send({ success: true, data: shift_time});
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
}

exports.deleteShift= (req, res) => {
    try {
      shift_timeModel //(paste your model)
        .aggregate([
          //Find role id and active_status is 1
          {
            $match: {
              $and: [{ _id: ObjectId(req.params.id) }, { active_status: 1 }]
            }
          },
  
          //********************************** */
  
  
  
          // Get all refered documents
          // *** 1 ***
          {
            $lookup: {
              from: 'users', // model name
              localField: '_id',
              foreignField: 'shift_time',
              as: 'user_doc' // name of the document contains all users
            }
          },
          // *** 2 ***
          
  
          //********************************** */
        ])
        .then(async doc => {
          //Push messages if there is any documents refered
          message = []
  
          //push message if there is any referenced document
          //********************************** */
  
  
          // *** 1 ***
          if (doc[0].user_doc.length > 0) {
            await message.push(
              'Please delete all the refered users by this shifttime'
            )
          }
          // *** 2 ***
         
          //********************************** */
  
  
  
          // Check if any referenced document with active_status 1 is present id DB
          if (message.length > 0) {
            res.status(200).send({ success: true, message: message })
  
            // Delet the document if there is no any referenced document
          } else if (message.length == 0) {
            shift_timeModel
              .deleteOne({ _id: ObjectId(req.params.id), active_status: 1 })
              .then(shift_time => {
                res.status(200).send({
                  success: true,
                  message: 'Shift Deleted Successfully!'
                })
                createLog(req.headers['authorization'], 'ShiftTime', 0)
              })
              .catch(err => {
                res
                  .status(200)
                  .send({ success: false, message: 'Role Not Found' })
              })
  
          
          }
        })
        .catch(err => {
          res.status(200).send({ success: false, message: 'ShiftTime Not Found' })
        })
    } catch (err) {
      res
        .status(200)
        .send({ success: false, error: err, message: 'An Error Catched' })
    }
  }