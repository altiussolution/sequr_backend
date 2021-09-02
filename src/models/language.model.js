const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const languageSchema = mongoose.Schema({
    language: {
        type: String,
        required: true
    },
    code: {
        type: String,
        // required: true
    },    
    created_at: {
        type: Date,
        default: Date.now
    }
}, { strict: true })


var Language = module.exports = mongoose.model('language', languageSchema);

module.exports.get = function (callback, limit) {
    Language.find(callback).limit(limit)
}