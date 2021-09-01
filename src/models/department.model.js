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
})


module.exports = mongoose.model('department', DepartmentSchema);