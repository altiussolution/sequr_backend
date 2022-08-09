var mongoose = require('mongoose'),
  Schema = mongoose.Schema

const ItemSchema = Schema(
  {
    item_name: {
      type: String,
      required: true
    },
    item_number: {
      type: String,
      required: true
    },
    sub_category_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'subCategory'
    },
    category_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'category'
    },
    supplier: [
      {
        suppliedBy: {
          type: Schema.Types.ObjectId,
          ref: 'supplier'
        }
      }
    ],
    is_active: {
      type: Boolean,
      default: false
    },
    calibration_month: {
      type: Date
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
    // image : {
    //   type : String
    // },
    image_path: {
      type: Array
    },
    video_path: {
      type: String
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
      required: true
    },
    active_status: {
      type: Number,
      enum: [0, 1],
      default: 1
    },
    generate_po_on: {
      type: Number,
      required: false
    },
    auto_purchase_order: {
      type: Boolean,
      default: false
    },
    in_stock: {
      type: Number,
      default: 0
    },
    returnable: {
      type: Boolean,
      default: false
    },
    generate_po_for: {
      type: Number
    },
    is_auto_po_generated: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: { updatedAt: 'updated_at' } }
)
ItemSchema.index({ item_name: 1, company_id: 1 }, { unique: true })
ItemSchema.index({ item_number: 1, company_id: 1 }, { unique: true })
ItemSchema.index({ '$**': 'text' })
module.exports = mongoose.model('item', ItemSchema)
