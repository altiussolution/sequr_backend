var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const CategorySchema = Schema({
    category_name: {
        type: String,
        required: true
    },
    category_code: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    },
    image_path: {
        type: String,
        required: true
    },
})


module.exports = mongoose.model('category', CategorySchema);