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
            required: true,
            ref: 'item'
        },
        allocation : {
            type: Schema.Types.ObjectId,
            ref: 'stockallocation'
        },
        qty : {
            type : Number
        }
    }],
    kitting: [{
        kit_id : {
            type: Schema.Types.ObjectId,
            ref: 'kit'
        },
        qty: {
            type : Number
        },
        item_quantity: {
            type : Number
        }
    }],
    total_kitting_quantity : {
        type : Number,
        default : 0
    },
    total_quantity : {
        type : Number,
        default : 0
    },
    cart_status : {
        type : Number,
        enum : [1,2,3],
        default : 1  // 1 -> In Cart , 2 -> Has taken , 3 -> Kept
    },
    kit_status : {
        type : Number,
        enum : [0,1,2,3],
        default : 0  // 0-> no kit , 1 -> In Kit , 2 -> Has taken , 3 -> Kept
    },
    status : {
        type : Number,
        enum : [0,1],
        default : 1
    }
})

module.exports = mongoose.model('cart', CartSchema);