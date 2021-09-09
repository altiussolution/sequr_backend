var Models = require('../models/index')

exports.country = (async (req, res) => {
    try {
        Models.countryModel.find({}, (err, doc) => {
            if (!err) {
                res.send({
                    status: 'Success',
                    list: doc
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
exports.state = (async (req, res) => {
    try {
        Models.stateModel.find({ countryCode: req.params.country_code }, (err, doc) => {
            if (!err) {
                res.send({
                    status: 'Success',
                    list: doc
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
exports.city = (async (req, res) => {
    try {
        Models.cityModel.find({ countryCode: req.params.country_code, stateCode: req.params.state_code }, (err, doc) => {
            if (!err) {
                res.send({
                    status: 'Success',
                    list: doc
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
exports.language = (async (req, res) => {
    try {
        Models.languageModel.find({}, (err, doc) => {
            if (!err) {
                res.send({
                    status: 'Success',
                    list: doc
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


exports.createState = ((req, res) => {
    try {
        var newState = new Models.stateModel(req.body);
        newState.save(function (err) {
            if (err) {
                res.status(200).send({
                    success: false,
                    message: 'error in adding state'
                });
            }
            else {
                res.status(200).send({ success: true, message: 'State Added Successfully!' });
            }
        });
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})

exports.createCity = ((req, res) => {
    try {
        var newCity = new Models.cityModel(req.body);
        newCity.save(function (err) {
            if (err) {
                res.status(200).send({
                    success: false,
                    message: 'error in adding city'
                });
            }
            else {
                res.status(200).send({ success: true, message: 'City Added Successfully!' });
            }
        });
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})