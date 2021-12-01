var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const BranchSchema = Schema({
    branch_name: {
        type: String,
        required: true
       // unique : true
    },
    branch_code: {
        type: String,
        required: true,
       unique : true
    },
    branch_address: {
        type: String,
        required: true
       //unique : true
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
        required: true
    },
    phone_number: {
        type: String,
        required: true,
        unique: true
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
    company_id: {
        type: Schema.Types.ObjectId,
        ref: 'company',
        required : true
      },
    active_status: {
        type: Number,
        enum: [0,1],
        default: 1
    }
},
{ timestamps: { updatedAt: 'updated_at' } }
)
BranchSchema.index({'$**': 'text'});
BranchSchema.index( { "branch_name": 1,  "company_id" : 1 }, { unique: true } )
BranchSchema.index( { "branch_address" : 1,  "company_id" : 1 }, { unique: true } )
module.exports = mongoose.model('branch', BranchSchema);