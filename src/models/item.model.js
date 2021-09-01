var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ItemSchema = Schema({
    item_name: {
        type: String,
        required: true
    },
    item_number: {
        type: String,
        required: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'category'
    },
    supplier_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'supplier'
    },
    is_active: {
        type: Boolean,
        default: false
    },
    calibration_month: {
        type: Date,
        required: true
    },
    is_item: {
        type: Boolean,
        default: false
    },
    is_gages: {
        type: Boolean,
        default: false
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
        default: 0
    }
})


module.exports = mongoose.model('item', ItemSchema);