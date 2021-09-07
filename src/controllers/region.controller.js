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
} catch (error) {
    res.send("An error occured");
    console.log(error);
}
})
exports.city = (async (req, res) => {
    try {
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