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
    permission : {
        type : Array,
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
    company_id: {
        type: Schema.Types.ObjectId,
        ref: 'company',
        //required : true
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
    }
},
{ timestamps: { updatedAt: 'updated_at' } }
)

RoleSchema.index({ role_name: 1, company_id: 1, role_id : 1 }, { unique: true });



module.exports = mongoose.model('roles', RoleSchema);