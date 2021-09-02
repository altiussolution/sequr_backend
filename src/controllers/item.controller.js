const { db } = require('../models/branch.model');
var Models = require('../models/index')
const { MongoClient, ObjectId } = require("mongodb");


exports.add_item = (async (req, res) => {
    var item = new Models.itemModel();
    console.log(req.files)
    item.item_name = req.body.item_name;
    item.item_number = req.body.item_number;
    item.category_id = ObjectId(req.body.category_id)
    item.supplier_id = req.body.supplier_id;
    item.is_active = req.body.is_active;
    item.calibration_month = req.body.calibration_month;
    item.is_gages = req.body.is_gages;
    item.description = req.body.description;
    item.calibration_month = req.body.calibration_month;
    if (req.files[0].mimetype.startsWith('image') && req.files[1].mimetype.startsWith('video')) {
        item.image_path = req.files[0].path
        item.video_path = req.files[1].path
    }
    else {
        item.image_path = req.files[1].path
        item.video_path = req.files[0].path
    }

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
})
exports.get_item = (async (req, res) => {
    Models.itemModel.find({ active_status: 0 }, (err, item) => {
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
})

exports.edit_item = (async (req, res) => {
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
    Models.itemModel.findOneAndUpdate({ _id: req.body._id }, item, (err, file) => {
        if (!err)
            res.send({
                status: 'Success',
                message: 'item edited'
            });
        else {
            res.send(err.message);
        }
    });
})

