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
    country_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'country'
    },
    state_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'state'
    },
    city_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'city'
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
        default: 1
    }
})


module.exports = mongoose.model('supplier', SupplierSchema);