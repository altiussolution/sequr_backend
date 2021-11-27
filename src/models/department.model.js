var mongoose = require('mongoose'),
  Schema = mongoose.Schema

const DepartmentSchema = Schema(
  {
    department_name: {
      type: String,
      required: true
      //unique: true
    },
    department_id: {
      type: String,
      required: true
      //unique: true
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
      required: true
    },
    active_status: {
      type: Number,
      enum: [0, 1],
      default: 1
    }
  },
  { timestamps: { updatedAt: 'updated_at' } }
)

<<<<<<< HEAD
DepartmentSchema.index({ department_name: 1, company_id: 1 }, { unique: true })
DepartmentSchema.index({ department_id: 1, company_id: 1 }, { unique: true })
module.exports = mongoose.model('department', DepartmentSchema)
=======
// DepartmentSchema.index( { "department_name": 1, "department_id": 1,"company_id" : 1 }, { unique: true } )

DepartmentSchema.index({ department_name: 1, company_id: 1 }, { unique: true })
DepartmentSchema.index({ department_id: 1, company_id: 1 }, { unique: true })

module.exports = mongoose.model('department', DepartmentSchema);
>>>>>>> 5bef60a76491367ceb6846f5683975eafe660b7f
