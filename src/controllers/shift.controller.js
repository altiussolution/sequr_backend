const { shift_timeModel } = require("../models");



exports.addShift = (async (req, res) => {
    try {
        var newShift = new shift_timeModel(req.body);
        newShift.save(function (err) {
            if (err) {
                res.status(200).send({
                    success: false,
                    message: 'error in adding shift time'
                });
            }
            else {
                res.status(200).send({ success: true, message: 'Shift Time Added Successfully!' });
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
        shift_timeModel.findByIdAndUpdate({ _id: req.params.id }, req.body, (err, file) => {
            if (!err)
                res.send({
                    status: 'Success',
                    message: 'shift updated'
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
        shift_timeModel.findByIdAndUpdate({ _id: req.params.id }, { active_status: 0 }, (err, file) => {
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

