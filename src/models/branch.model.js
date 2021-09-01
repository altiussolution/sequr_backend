var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const BranchSchema = Schema({
    branch_name: {
        type: String,
        required: true
    },
    branch_code: {
        type: String,
        required: true
    },
    branch_address: {
        type: String,
        required: true
    },
    state_id: {
        type: String,
        required: true
    },
    city_id: {
        type: String,
        required: true
    },
    zip_code: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    fax: {
        type: String,
        required: true
    },
    email_id: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('branch', BranchSchema);