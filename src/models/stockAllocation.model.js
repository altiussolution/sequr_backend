var mongoose = require('mongoose'),
  Schema = mongoose.Schema

const StockAllocationSchema = Schema({
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'category'
  },
  sub_category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'subCategory'
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
    ref: 'purchaseorder'
  },
  quantity: {
    type: Number,
    required: true
  },
  total_quantity: {
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
    type: String
  },
  company_id: {
    type: Schema.Types.ObjectId,
    ref: 'company',
    required : true
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
    enum: [0, 1],
    default: 1
  },
  status: {
    type: Number,
    enum: [0, 1],
    default: 1
  },
  compartment_number: {
    type: Number,
    required: true
  }
})
StockAllocationSchema.index({'$**': 'text'});


module.exports = mongoose.model('stockallocation', StockAllocationSchema)
