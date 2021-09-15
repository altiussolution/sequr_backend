var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const StockAllocationSchema = Schema({
    category_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'category'
    },
    item_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'item'
    },
    supplier_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'supplier'
    },
    purchase_order_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'purchase_order'
    },
    quantity: {
        type: Number,
        required: true
    },
    cube_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'cube'
    },
    bin_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'bin'
    },
    compartment_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'compartment'
    },
    description: {
        type: String
    },
    image_path: {
        type: String,
        required: true
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


module.exports = mongoose.model('stockallocation', StockAllocationSchema);