const { boolean } = require('joi');

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
    company_id: {
        type: Schema.Types.ObjectId,
        ref: 'company',
        required : true
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
    },
    is_old_kit: {
        type: Boolean,
        default : false,    
        required : true
    },

},
{ timestamps: { updatedAt: 'updated_at' } }
)


module.exports = mongoose.model('kit', KitSchema);