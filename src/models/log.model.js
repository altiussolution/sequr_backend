const mongoose = require('mongoose')
const Schema = mongoose.Schema

const logSchema = mongoose.Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users'
    },
    module_name: {
      type: String,
      required: true
    },
    action: {
      type: Number,
      enum: [0, 1, 2],
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now,
      required: true
    }
  },
  { strict: true }
)

logSchema.index({ '$**': 'text' })
module.exports = mongoose.model('log', logSchema)
