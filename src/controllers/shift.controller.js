const { shift_timeModel } = require("../models");
const { createLog } = require('../middleware/crud.middleware')


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
    try {
        shift_timeModel.find({ active_status: 1 }, (err, shift) => {
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

exports.deleteShift = (async (req, res) => {
    try {
        shift_timeModel.findByIdAndUpdate(req.params.id, { active_status: 0 }, (err, file) => {
            if (!err)
                res.send({
                    status: 'Success',
                    message: 'shift deleted'
                });
            else {
                res.send(err.message);
            }
            createLog(req.headers['authorization'], 'ShiftTime', 0)
        });
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})

exports.getShiftfilter =  (req, res) => {
    var shift_type = req.query.shift_type;
   
    if( shift_type ){
        var query = { shift_type :shift_type }
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
