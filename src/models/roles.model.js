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
})


module.exports = mongoose.model('roles', RoleSchema);