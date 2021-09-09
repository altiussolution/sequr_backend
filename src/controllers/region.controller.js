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


exports.createState = (async (req, res) => {
           await Models.stateModel.create(req.body);  

                res.status(200).send({
                    success: false,
                    message: 'State Created'
})

exports.createCity = (async (req, res) => {
  
           await Models.cityModel.create(req.body);  

                res.status(200).send({
                    success: false,
                    message: 'City Created'
 
})