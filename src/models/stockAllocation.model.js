var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const StockAllocationSchema = Schema({
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'category'
    },
    item: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'item'
    },
    supplier: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'supplier'
    },
    purchase_order: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'purchase_order'
    },
    quantity: {
        type: Number,
        required: true
    },
    cube: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'cube'
    },
    bin: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'bin'
    },
    compartment: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'compartment'
    },
    description: {
        type: String
    },
    image_path: {
        type: String,
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