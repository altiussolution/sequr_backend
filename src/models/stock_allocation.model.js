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
})


module.exports = mongoose.model('stock_allocation', StockAllocationSchema);