var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const RoleSchema = Schema({
    role_name: {
        type: String,
        required: true
    },
    role_id: {
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
        default: 0
    }
})


module.exports = mongoose.model('roles', RoleSchema);