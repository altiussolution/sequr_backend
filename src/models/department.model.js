var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const DepartmentSchema = Schema({
    department_name: {
        type: String,
        required: true
    },
    department_id: {
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


module.exports = mongoose.model('department', DepartmentSchema);