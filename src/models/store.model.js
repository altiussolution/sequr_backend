const { array } = require('joi');
var mongoose = require('mongoose'),
  Schema = mongoose.Schema

const StoreSchema = Schema(
  {
    
   
    _id_rev : {
      type : String
    },
  
    data: {
      cart: [
        {
          item: {
            type: Object,
           
            item_name: {
              type : String
            },
            image_path: [{
             type: Array
            }
            ],
            image : {
              type : String
            }
          },
          allocation: {
            type : String
          },
          qty: {
            type: Number
          },
          cart_status: {
            type: Number,
            enum: [1, 2, 3, 4],
            default: 1 // 1 -> In Cart , 2 -> Has taken , 3 -> Kept, 4 -> return
          },
          item_details: {
            type : Object,
          category: {
            type: String,
          },
          subcategory: {
            type: String
},
item : {
  type : String
},
supplier: {
            type: String
},
purchaseorder: {
            type: String
},
       quantity: {
type :Number
},
        total_quantity: {
type :Number
},
       cube: {
        type : Object,
         cube_name: {
type : String
},
         cube_id: {
type : String
},
       },
             bin: {
        type: Object,
         bin_name: {
type : String
},
         bin_id: {
type : String
},
       },
             compartment: {
              type: Object,
        
         compartment_name: {
type : String
},
         compartment_id: {
type : String
},
       },
       description: {
type : String
},
       
       
       active_status: {
type : Number,
default : 1
},
        status: {
   type: Number,
   enum: [0, 1],
   default: 1
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
compartment_number: {
type : Number
},
po_history : [

],
}
      }
],
Kits: [


  {
    cartid : {
      type : String,
    },
    kit_cart_id : {
      type : String,
    },
    kit_id : {
      type : String
    },
    qty: {
      type: Number
    },
    kit_status: {
      type: Number,
      enum: [1, 2, 3, 4],
      default: 1 // 0-> no kit , 1 -> In Kit , 2 -> Has taken , 3 -> Kept, 4-> Return
    },
    kit_item_details: [{
    type : Object,
  category: {
    type: String,
  },
  subcategory: {
    type: String
},
item : {
type : String
},
supplier: {
    type: String
},
purchaseorder: {
    type: String
},
quantity: {
type :Number
},
total_quantity: {
type :Number
},
cube: {
type : Object,
 cube_name: {
type : String
},
 cube_id: {
type : String
},
},
     bin: {
type: Object,
 bin_name: {
type : String
},
 bin_id: {
type : String
},
},
     compartment: {
      type: Object,

 compartment_name: {
type : String
},
 compartment_id: {
type : String
},
},
description: {
type : String
},


active_status: {
type : Number,
default : 1
},
status: {
type: Number,
enum: [0, 1],
default: 1
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
compartment_number: {
type : Number
},
po_history : [

],
    
}]}
],
total_quantity : {
  type : Number
},
    },
    user : {
      type : String
    
    },
    company_id: {
      type : String
  },
cartinfo : {
  type : Number
},
kitinfo: {
  type : Number
},
updatestatus : {
  type : Number
}
})
module.exports = mongoose.model('store', StoreSchema, 'store');