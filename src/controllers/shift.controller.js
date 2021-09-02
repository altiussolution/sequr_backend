var Models = require('../models/index')


exports.add_shift = (async (req, res) => {
    console.log(req.body)
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
})
exports.get_shift = (async (req, res) => {
    Models.shift_timeModel.find({ active_status: 0 }, (err, shift) => {
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
})

exports.edit_shift = (async (req, res) => {
    var shift = {}
    shift.shift_type = req.body.shift_type;
    shift.start_time = req.body.start_time;
    shift.end_time = req.body.end_time
    Models.shift_timeModel.findOneAndUpdate({ _id: req.body._id }, shift, (err, file) => {
        if (!err)
            res.send({
                status: 'Success',
                message: 'shift edited'
            });
        else {
            res.send(err.message);
        }
    });
})

exports.delete_shift = (async (req, res) => {
    Models.shift_timeModel.findOneAndUpdate({ _id: req.body._id }, { active_status: 1 }, (err, file) => {
        if (!err)
            res.send({
                status: 'Success',
                message: 'shift deleted'
            });
        else {
            res.send(err.message);
        }
    });
})

