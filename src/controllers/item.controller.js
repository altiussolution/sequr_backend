const { db } = require('../models/branch.model');
var Models = require('../models/index')
const { MongoClient, ObjectId } = require("mongodb");


exports.addItem = (async (req, res) => {
    try {
        var item = new Models.itemModel();
        item.item_name = req.body.item_name;
        item.item_number = req.body.item_number;
        item.category_id = ObjectId(req.body.category_id)
        item.supplier_id = req.body.supplier_id;
        item.is_active = req.body.is_active;
        item.calibration_month = req.body.calibration_month;
        item.is_gages = req.body.is_gages;
        item.description = req.body.description;
        item.calibration_month = req.body.calibration_month;
        item.image_path = req.body.calibration_month
        item.video_path = req.files[1].path

        item.save((err, file) => {
            if (!err)
                res.send({
                    status: 'Success',
                    message: 'item added'
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
exports.getItem = (async (req, res) => {
    try {
        Models.itemModel.find({ active_status: 1 }, (err, item) => {
            if (!err) {
                res.send({
                    status: 'Success',
                    item: item
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

exports.editItem = (async (req, res) => {
    try {
        var item = {}
        item.item_name = req.body.item_name;
        item.item_number = req.body.item_number;
        item.category_id = ObjectId(req.body.category_id)
        item.supplier_id = req.body.supplier_id;
        item.is_active = req.body.is_active;
        item.calibration_month = req.body.calibration_month;
        item.is_gages = req.body.is_gages;
        item.description = req.body.description;
        item.calibration_month = req.body.calibration_month;
        item.image_path = req.body.image_path || req.files[0].path
        item.video_path = req.files[1].path || req.files[0].path || req.body.video_path;
        Models.itemModel.findByIdAndUpdate({ _id: req.params.id }, item, (err, file) => {
            if (!err)
                res.send({
                    status: 'Success',
                    message: 'item edited'
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

