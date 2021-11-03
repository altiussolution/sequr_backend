var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const KitSchema = Schema({
    kit_name: {
        type: String,
        required: true
    },
    image_path: {
        type: String,
    },
    kit_data: [
        {
            category_id:{
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'category'
            },
            item_id:{
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'item'
            },
            sub_category_id: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'subCategory'
            },
            qty : {
                type : Number
            },
            description : {
                type : String
            }
        }
    ],
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