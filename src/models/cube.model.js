var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const CubeSchema = Schema({
    cube_name: {
        type: String,
        required: true,
        unique: true
    },
    cube_id: {
        type: String,
        required: true,
        unique: true
    },
    cube_type: {
        type: Number,
        enum: [0,1,2],
        default: 0
    },
    bin_max: {
        type: Number,
        required: true
    },
    bin_min: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    },
    branch_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'branch'
    },
    employee_status: {
        type: Number,
        enum: [0,1],
        default: 0
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

CubeSchema.index({'$**': 'text'});
module.exports = mongoose.model('cube', CubeSchema);