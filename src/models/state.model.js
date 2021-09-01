const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = mongoose.Schema({
    name: {
        type: String,
        // required: true
    },
    isoCode: {
        type: String,
        // required: true
    },
    countryCode: {
        type: String,
        // required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { strict: true })


var State = module.exports = mongoose.model('state', stateSchema);

module.exports.get = function (callback, limit) {
    State.find(callback).limit(limit)
}