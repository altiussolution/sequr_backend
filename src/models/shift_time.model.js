var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ShiftTimeSchema = Schema({
    shift_type: {
        type: Number,
        enum: [1,2,3],
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
})


module.exports = mongoose.model('shift_time', ShiftTimeSchema);