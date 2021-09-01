var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const SupplierSchema = Schema({
    supplier_name: {
        type: String,
        required: true
    },
    supplier_code: {
        type: String,
        required: true
    },
    supplier_address: {
        type: String,
        required: true
    },
    state_id: {
        type: String,
        required: true,
    },
    city_id: {
        type: String,
        required: true,
    },
    zip_code: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    fax: {
        type: String,
        required: true,
    },
    email_id: {
        type: String,
        required: true,
    },
    po_email: {
        type: String,
        required: true,
    },
    supplier_item: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    deleted_at: {
        type: Date,
        default: null
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    active_status: {
        type: Number,
        enum: [0,1],
        default: 0
    }
})


module.exports = mongoose.model('supplier', SupplierSchema);