var mongoose = require('mongoose'),
  Schema = mongoose.Schema

const ShiftTimeSchema = Schema(
  {
    shift_type: {
      type: Number,
      enum: [1, 2, 3, 4],
      default: 1
    },
    start_time: {
      type: String,
      required: true
    },
    end_time: {
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
    company_id: {
      type: Schema.Types.ObjectId,
      ref: 'company',
      required: true
    },
    active_status: {
      type: Number,
      enum: [0, 1],
      default: 1
    }
  },
  { timestamps: { updatedAt: 'updated_at' } }
)

ShiftTimeSchema.index(
  { start_time: 1, end_time: 1, company_id: 1 },
  { unique: true }
)

module.exports = mongoose.model('shift_time', ShiftTimeSchema)
