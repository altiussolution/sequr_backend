const { array } = require('joi')

var mongoose = require('mongoose'),
  Schema = mongoose.Schema

const CartSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users'
    },
    cart: [
      {
        item: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'item'
        },
        allocation: {
          type: Schema.Types.ObjectId,
          ref: 'stockallocation'
        },
        qty: {
          type: Number
        },
        cart_status: {
          type: Number,
          enum: [1, 2, 3, 4],
          default: 1 // 1 -> In Cart , 2 -> Has taken , 3 -> Kept, 4 -> return
        }
      }
    ],
    kitting: [
      {
        kit_id: {
          type: Schema.Types.ObjectId,
          ref: 'kit'
        },
        qty: {
          type: Number
        },
        item_quantity: {
          type: Number
        },
        kit_status: {
          type: Number,
          enum: [1, 2, 3, 4],
          default: 1 // 0-> no kit , 1 -> In Kit , 2 -> Has taken , 3 -> Kept, 4-> Return
        },
        created_at: {
          type: Date,
          default: Date.now
        },
        untaken_and_returned_items: {
          type: Array
        },
        updated_at: {
          type: Date,
          default: Date.now
        }
      }
    ],
    total_kitting_quantity: {
      type: Number,
      default: 0
    },
    total_quantity: {
      type: Number,
      default: 0
    },
    company_id: {
      type: Schema.Types.ObjectId,
      ref: 'company',
      required: true
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 1
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
    }
  },
  { timestamps: { updatedAt: 'updated_at' } }
)
module.exports = mongoose.model('cart', CartSchema)
