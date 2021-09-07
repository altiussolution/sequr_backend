var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const KitSchema = Schema({
    kit_name: {
        type: String,
        required: true
    },
    image_path: {
        type: String,
        required: true
    },
    kit_data: {
        type: Array,
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


module.exports = mongoose.model('kit', KitSchema);