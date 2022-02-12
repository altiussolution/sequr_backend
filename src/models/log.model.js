const mongoose = require('mongoose')
const Schema = mongoose.Schema

const logSchema = mongoose.Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    module_name: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    stock_allocation_id: {
      type: Schema.Types.ObjectId,
      ref: 'stockallocation'
    },
    trasaction_qty: {
      type: Number
    },
    item_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'item'
    },
    po_history: [
      {
        po_id: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'purchaseorder'
        },
        used_item_qty: {
          type: Number,
          required: true
        }
      }
    ],
    company_id: {
      type: Schema.Types.ObjectId,
      ref: 'company',
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now,
      required: true
    },
    updated_at: {
      type: Date,
      default: Date.now,
      required: true
    }
  },
  { strict: true }
)

logSchema.index({ '$**': 'text' })
module.exports = mongoose.model('log', logSchema)
