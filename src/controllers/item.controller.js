const { db } = require('../models/branch.model');
var Models = require('../models/index');
const {itemModel} =  require("../models");
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
        item.image_path = req.body.image_path;
        item.video_path = req.body.video_path;

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
        Models.itemModel.findByIdAndUpdate({ _id: req.params.id }, req.body, (err, file) => {
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

exports.upload = (async (req, res) => {
    try {
        console.log(req.files.length)


        console.log(req.files.length === 1)
        console.log(req.files[0].mimetype.startsWith('image'))

        fileLocations = {}
        if (req.files) {
            if (req.files.length === 2 && req.files[0].mimetype.startsWith('image') && req.files[1].mimetype.startsWith('video')) {
                fileLocations['image_path'] = `${req.files[0].destination}/${req.files[0].originalname}`
                fileLocations['video_path'] = `${req.files[1].destination}/${req.files[1].originalname}`
            }

            else if (req.files.length === 1 && req.files[0].mimetype.startsWith('image')) {
                fileLocations['image_path'] = `${req.files[0].destination}/${req.files[0].originalname}`
            }
            else if (req.files.length === 1 && req.files[0].mimetype.startsWith('video')) {
                fileLocations['video_path'] = `${req.files[0].destination}/${req.files[0].originalname}`
            }
            else {
                fileLocations['image_path'] = `${req.files[1].destination}/${req.files[1].originalname}`
                fileLocations['video_path'] = `${req.files[0].destination}/${req.files[0].originalname}`
            }

            res.status(200).send({
                Message: 'Profile Added Sucessfully',
                fileLocations: fileLocations
            })
        }

    } catch (err) {
        res.status(400).send(err);
    }

})

exports.getItemByCategory = (async (req,res) =>{
    try{
        var itemsInCategory =  await itemModel.find({category_id : req.params.category_id}).exec();
        res.status(200).send({data : itemsInCategory})
    }catch(err) {
        res.status(400).send(err);
    }
    
})
