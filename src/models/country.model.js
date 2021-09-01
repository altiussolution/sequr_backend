const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countrySchema = mongoose.Schema({
    isoCode: {
        type: String,
        // required: true
    },
    name: {
        type: String,
        // required: true
    },
    currency: {
        type: String,
        // required: true
    },
    phonecode: {
        type: String,
        // required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { strict: true })


var Country = module.exports = mongoose.model('country', countrySchema);

module.exports.get = function (callback, limit) {
    Country.find(callback).limit(limit)
}