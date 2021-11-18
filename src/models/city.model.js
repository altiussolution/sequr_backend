const mongoose = require('mongoose')
const Schema = mongoose.Schema

const citySchema = mongoose.Schema(
  {
    name: {
      type: String
      // required: true
    },
    countryCode: {
      type: String
      // required: true
    },
    stateCode: {
      type: String
      // required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  },
  { strict: true }
)

var City = (module.exports = mongoose.model('city', citySchema))

module.exports.get = function (callback, limit) {
  City.find(callback).limit(limit)
}
