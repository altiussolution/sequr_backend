var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const CompartmentSchema = Schema({
    compartment_name: {
        type: String,
        required: true
    },
    compartment_id: {
        type: String,
        required: true
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
    }
})


module.exports = mongoose.model('compartment', CompartmentSchema);