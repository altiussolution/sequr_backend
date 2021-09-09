const { itemModel } = require("../models");

exports.addItem = (async (req, res) => {
    try {
        var newItem = new itemModel(req.body);
        newItem.save(function (err) {
            if (err) {
                res.status(200).send({
                    success: false,
                    message: 'error in adding item'
                });
            }
            else {
                res.status(200).send({ success: true, message: 'Item Added Successfully!' });
            }
        });
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})
exports.getItem = (async (req, res) => {
    try {
        itemModel.find({ active_status: 1 }, (err, item) => {
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

exports.updateItem = (async (req, res) => {
    try {
        itemModel.findByIdAndUpdate({ _id: req.params.id }, req.body, (err, file) => {
            if (!err)
                res.send({
                    status: 'Success',
                    message: 'item Updated'
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
