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
    company_id: {
        type: Schema.Types.ObjectId,
        ref: 'company',
        //required : true
      },
    active_status: {
        type: Number,
        enum: [0,1],
        default: 1
    }
},
{ timestamps: { updatedAt: 'updated_at' } }
)


module.exports = mongoose.model('category', CategorySchema);