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
    }
})


module.exports = mongoose.model('kit', KitSchema);