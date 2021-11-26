var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const CompanySchema = Schema({
    company_name: {
      type: String,
      required: true,
      unique : true
    },
    contact_person_name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    email_id: {
      type: String,
      required: true,
      unique: true
    },
    contact_no: {
      type: String,
      required: true,
      unique: true
    },
  
    company_id: {
      type: String,
      required: true,
      unique: true
    },
    country_id: {
      type: Schema.Types.ObjectId,
      ref: 'country'
    },
    state_id: {
      type: Schema.Types.ObjectId,
      ref: 'state'
    },
    city_id: {
      type: Schema.Types.ObjectId,
      ref: 'city'
    },
    company_pic: {
      type: String,
      // unique: true
    },
    status: {
      type: Boolean,
      default: false
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
    },
    zip_code: {
      type: String,
      required: true
    }
  })

  module.exports = mongoose.model('company', CompanySchema);