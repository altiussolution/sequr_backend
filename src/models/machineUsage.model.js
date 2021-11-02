const mongoose = require('mongoose')
const Schema = mongoose.Schema

const machineUsageSchema = mongoose.Schema(
  {
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
    created_at: {
      type: Date,
      default: Date.now,
      required: true
    },
    machine_usage: {
      type: Number,
      required: true
    }
  },
  { strict: true }
)

machineUsageSchema.index({'$**': 'text'});
module.exports = mongoose.model('machineUsage', machineUsageSchema);

