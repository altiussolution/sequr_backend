var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const CompartmentSchema = Schema({
    compartment_name: {
        type: String,
        required: true,
        unique: true
    },
    compartment_id: {
        type: String,
        required: true,
        unique: true
    },
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
    item_max_cap: {
        type: Number,
        required: true
    },
    item_min_cap: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    is_removed: {
        type: Boolean,
        default: false
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

CompartmentSchema.index({'$**': 'text'});
module.exports = mongoose.model('compartment', CompartmentSchema);