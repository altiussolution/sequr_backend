var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const SupplierSchema = Schema({
    supplier_name: {
        type: String,
        required: true,
        unique : true
    },
    supplier_code: {
        type: String,
        required: true,
        unique : true
    },
    supplier_address: {
        type: String,
        required: true,
        unique : true
    },
    country_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'country'
    },
    state_id: {
        type: Schema.Types.ObjectId,
        ref: 'state'
    },
    city_id: {
        type: Schema.Types.ObjectId,
        ref: 'city'
    },
    
    zip_code: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
        unique : true
    },
    fax: {
        type: String,
        required: false
    },
    email_id: {
        type: String,
        required: true,
        unique : true
    },
    po_email: {
        type: String,
        required: true,
    },
    company_id: {
        type: Schema.Types.ObjectId,
        ref: 'company',
        //required : true
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
},
{ timestamps: { updatedAt: 'updated_at' } }
)


module.exports = mongoose.model('supplier', SupplierSchema);