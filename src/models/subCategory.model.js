var mongoose = require('mongoose'),
  Schema = mongoose.Schema

const SubCategorySchema = Schema({
  category_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'category'
  },
  sub_category_name: {
    type: String,
    required: true
  },
  sub_category_code: {
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
    type: String
  },
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
    enum: [0, 1],
    default: 1
  }
},
{ timestamps: { updatedAt: 'updated_at' } }
)
SubCategorySchema.index({ sub_category_name: 1, company_id: 1, sub_category_code : 1 }, { unique: true });


SubCategorySchema.index({'$**': 'text'});
module.exports = mongoose.model('subCategory', SubCategorySchema)
