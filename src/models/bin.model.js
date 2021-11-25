var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const BinSchema = Schema({
    bin_name: {
        type: String,
        required: true
    },
    bin_id: {
        type: String,
        required: true
    },
    cube_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'cube'
    },
    // auto_purchase_order: {
    //     type: Boolean,
    //     default: false
    // },
    // item_alert: {
    //     type: Boolean,
    //     default: false
    // },
    // print_receipt: {
    //     type: Boolean,
    //     default: false
    // },
    // item_max_cap: {
    //     type: Number,
    //     required: true
    // },
    // item_min_cap: {
    //     type: Number,
    //     required: true
    // },
    description: {
        type: String,
    },
    is_removed: {
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

BinSchema.index({'$**': 'text'});
module.exports = mongoose.model('bin', BinSchema);