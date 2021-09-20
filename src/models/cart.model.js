var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const CartSchema = Schema({
    user : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    cart : [{
        item:{
            type: Schema.Types.ObjectId,
            ref: 'item'
        },
        allocation : {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'stockallocation'
        },
        qty : {
            type : Number
        }
    }],
    total_quantity : {
        type : Number
    },
    cart_status : {
        type : Number,
        enum : [1,2,3],
        default : 1  // 1 -> In Cart , 2 -> Has taken , 3 -> Kept
    }    
})

module.exports = mongoose.model('cart', CartSchema);