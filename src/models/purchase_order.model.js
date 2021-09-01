var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const PurchaseOrderSchema = Schema({
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
    po_number: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    po_date: {
        type: Date,
        required: true
    },
    is_received: {
        type: Boolean,
        default: false
    },
    received_date: {
        type: Date,
        required: true
    },
    description: {
        type: String
    },
    invoice_path: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        enum: [1,2],
        default: 1
    },
})


module.exports = mongoose.model('purchase_order', PurchaseOrderSchema);