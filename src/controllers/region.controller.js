var Models = require('../models/index')

exports.country = (async (req, res) => {
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
})
exports.state = (async (req, res) => {
    Models.stateModel.find({ countryCode: req.query.country_code }, (err, doc) => {
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
})
exports.city = (async (req, res) => {
    Models.cityModel.find({ countryCode: req.query.country_code, stateCode: req.query.state_code }, (err, doc) => {
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
})
exports.language = (async (req, res) => {
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
})