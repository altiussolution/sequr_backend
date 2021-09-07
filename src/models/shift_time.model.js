var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ShiftTimeSchema = Schema({
    shift_type: {
        type: Number,
        enum: [1,2,3,4],
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
    active_status: {
        type: Number,
        enum: [0,1],
        default: 1
    }
})


module.exports = mongoose.model('shift_time', ShiftTimeSchema);