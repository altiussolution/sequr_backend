var Models = require('../models/index')


exports.addCategory = (async (req, res) => {
    try {
        var category = new Models.categoryModel();
        category.category_name = req.body.category_name;
        category.category_code = req.body.category_code;
        category.is_active = req.body.is_active
        category.description = req.body.description;
        category.image_path = req.file.path;
        category.save((err, file) => {
            if (!err)
                res.send({
                    status: 'Success',
                    message: 'Category added'
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
exports.getCategory = (async (req, res) => {
    try {
        Models.categoryModel.find({ active_status: 1 }, (err, category) => {
            if (!err) {
                res.send({
                    status: 'Success',
                    category: category
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

exports.editCategory = (async (req, res) => {
    try {
        var category = {}
        category.category_name = req.body.category_name;
        category.category_code = req.body.category_code;
        category.is_active = req.body.is_active
        category.description = req.body.description;
        category.image_path = req.file.path;
        Models.categoryModel.findOneAndUpdate({ _id: req.params.id }, category, (err, file) => {
            if (!err)
                res.send({
                    status: 'Success',
                    message: 'Category edited'
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

