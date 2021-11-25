var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
const Joi = require("joi");


const UserSchema = Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email_id: {
    type: String,
    required: true,
    unique : true
  },
  contact_no: {
    type: String,
    required: true,
    unique : true
  },
  date_of_birth: {
    type: Date,
    required: true
  },
  role_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'roles'
  },
  language_prefered: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'language'

  },
  employee_id: {
    type: String,
    required: true,
    unique : true
  },
  item_max_quantity: {
    type: Number,
    required: true
  },
  branch_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'branch'
  },
  shift_time_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'shift_time'
  },
  department_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'department'
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
  profile_pic: {
    type: String,
    unique:true
  },
  company_id: {
    type: Schema.Types.ObjectId,
    ref: 'company',
    required : true
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  status: {
    type: Number,
    enum: [0, 1],
    default: 1
  },
  password: {
    type: String,
    required: true
  },
  new_pass_req : {
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
  status: {
    type: Boolean,
    default: false
},
  token: { type: String },
},
{ timestamps: { updatedAt: 'updated_at' } }
)


// module.exports = mongoose.model('users', UserSchema);
const User = mongoose.model("users", UserSchema);

const validate = (users) => {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    email_id: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(users);
};

module.exports = { validate, User }