var Models = require('../models/index')


exports.addShift = (async (req, res) => {
    try {
        var shift = new Models.shift_timeModel();
        shift.shift_type = req.body.shift_type;
        shift.start_time = req.body.start_time;
        shift.end_time = req.body.end_time
        shift.save((err, file) => {
            if (!err)
                res.send({
                    status: 'Success',
                    message: 'shift added'
                });
            else {
                res.send(err.message);
            }
        });
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})
exports.getShift = (async (req, res) => {
    try {
        Models.shift_timeModel.find({ active_status: 1 }, (err, shift) => {
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

exports.editShift = (async (req, res) => {
    try {
        Models.shift_timeModel.findByIdAndUpdate({ _id: req.params.id }, req.body, (err, file) => {
            if (!err)
                res.send({
                    status: 'Success',
                    message: 'shift edited'
                });
            else {
                res.send(err.message);
            }
        });
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})

exports.deleteShift = (async (req, res) => {
    try {
        Models.shift_timeModel.findByIdAndUpdate({ _id: req.params.id }, { active_status: 0 }, (err, file) => {
            if (!err)
                res.send({
                    status: 'Success',
                    message: 'shift deleted'
                });
            else {
                res.send(err.message);
            }
        });
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})

