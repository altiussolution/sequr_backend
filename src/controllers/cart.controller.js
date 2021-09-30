const {CartModel,itemModel,stockAllocationModel} = require('../models');
const AddCart  = require("../services/cart.services")
const {Cart} = require("../utils/enum.utils")

exports.addToCart = ((req,res) => {
    var body = req.body;
    var userId = req.user.user_id;
    var options = { upsert: true, new: true, setDefaultsOnInsert: true };
    var query = {user : userId}
    stockAllocationModel.findOne({item : body.item},['_id','quantity']).then(async isQuantity =>{ //, quantity : {$gte: body.qty}
        if(!isQuantity){
            res.status(200).send({status : true , message : `Stock Not Yet Allocated`})
        }
        else if(body.qty > isQuantity.quantity){
            res.status(200).send({status : true , message : `Available quantity for this item is ${isQuantity.quantity}`})
        }else{
            var productId = body.item;
            // var product = await itemModel.findById(productId).exec()
            CartModel.findOne(query).then(CartData =>{
                var cart = AddCart({
                    cartData : CartData ? CartData : body,
                    item:productId,
                    allocation : isQuantity._id,  
                    userQty : body.total_quantity})
                    
                CartModel.findOneAndUpdate(query,cart, options).then(is_create =>{
                    res.status(200).send({ success: true, message: 'Successfully added into cart!' });
                }).catch(err =>{
                    res.status(201).send({status : false , message : err.name})
                })
            }).catch(err =>{
                console.log(err, 'err occured')
            })
        }
    }).catch(err => {
        res.status(201).send({status : false , message : err.name})
    })
})

exports.updateCart = (async (req,res) =>{
    try{
        var cartId = req.body.cart_id;
        var qty = req.body.qty;
        var itemId = req.body.item ? req.body.item : req.body.update_item;
        var kitId = req.body.kit ? req.body.kit : req.body.update_kit_id;
        var userId = req.user.user_id;
        var allocation = req.body.allocation
        var cart_status = req.body.cart_status
        var kit_status = req.body.kit_status
        var cartUpdate;
        var isErrResponse = false
        
        var data = await CartModel.findOne({_id : cartId, user : userId, status : 1 }).exec() //, cart_status : Cart.In_Cart
        if(!data){
            isErrResponse = true;
            res.status(200).send({message : 'Cart not found or Deleted'})
        }
        else if(qty){
            cartUpdate = AddCart(
                {
                    cartData : data,
                    item:itemId,
                    allocation : allocation,  
                    userQty : qty, 
                    updateQty : true
                }
            )
        }else if(cart_status){

            var index = data.cart.findIndex(p => p._id == itemId);
            data.cart[index].cart_status = cart_status
            cartUpdate = {cart : data.cart, total_quantity : data.total_quantity-data.cart[index].qty} 

        }else if(kit_status){
            var index = data.kitting.findIndex(p => p._id == kitId);
            data.kitting[index].kit_status = kit_status
            cartUpdate = {
                kitting : data.kitting, 
                total_kitting_quantity : data.total_kitting_quantity-data.kitting[index].qty,
                updated_at : Date.now
            } 

        }

        if(!isErrResponse){
            try{
                CartModel.findByIdAndUpdate(cartId, cartUpdate).then(cartUpdate =>{
                    res.status(200).send({ success: true, message: 'Cart Updated Successfully!' });
                }).catch(error =>{
                    res.status(200).send({ success: false, error: error, message : 'An Error Occured' });
                }) 
              
            }catch(err){
                res.status(200).send({ success: false, error: err, message : 'An Error Catched' });  
            }
        }
      

    }catch(err){
        console.log(err)
        res.status(201).send({status : false , message : err.name})
    }
    
})

exports.myCart = ((req,res) =>{
    try{
        var userId = req.user.user_id;
        CartModel.find({user:userId, cart_status : Cart.In_Cart},['cart','total_quantity','cart_status']).populate('cart.item',['item_name','image_path']).then(mycart =>{
            res.status(200).send(mycart)
        }).catch(err=>{
            console.log(err,'catch error')
        })
    }catch(err){
        res.status(200).send({status : false , message : err.name})
    }
})
  
exports.itemHistory = (async (req,res) => {
    try{
        var userId = req.user.user_id;
        var CartHistory = await CartModel.find({user:userId, cart_status : Cart.In_Cart},['cart','updated_at']).populate('cart.item',['item_name','image_path']).exec();
        var KitHistory = await CartModel.find({user:userId, kit_status : Cart.In_Cart},['kitting','updated_at'])
        .populate({
            path : 'kitting.kit_id',
            populate : {
                path : 'kit_data.item_id'
            }
        })
        .exec()
        var kitData = []
        for await(let [i,item] of KitHistory.entries()){
            for(let [j,val] of item.kitting.entries()){
                for(let [k,data] of val.kit_id.kit_data.entries()){
                    stockData = await stockAllocationModel.find({item:data.item_id._id}).populate('item',['item_name','image_path']).populate('cube',['cube_name','cube_id']).populate('bin',['bin_name','bin_id']).populate('compartment',['compartment_name','compartment_id']).exec()
                    kitData.push({
                        cart_id : item._id,
                        update_kit_id : val._id,
                        kit_name : val.kit_id.kit_name,
                        kit_item_details : stockData,
                        created_at : val.created_at,
                        updated_at : val.updated_at
                    })
                }
            }
        }  

        res.status(200).send({status : true, Cart : CartHistory, Kits : kitData})
    }catch(err){
        res.status(201).send({status : false , message : err.name})
    }
  
})

exports.return = ((req,res) => {
    var body = req.body;
    try{
        CartModel.updateOne(query, update, options,(err,data) =>{
            if(data.modifiedCount){
                res.status(201).send({status : false , message : "Returned Sucessfully"})
            }else{
                res.status(201).send({status : false , message : "Nothing to modify"})
            }
        })
    }catch(err){
        res.status(201).send({status : false , message : err.name})
    }
    
})

exports.deleteItemFromCart = ((req,res) =>{
    var cart_id = req.body.cart_id;
    var item_id = req.body.item_id;
    var userId = req.user.user_id;
    var options = { upsert: true, new: true, setDefaultsOnInsert: true };
    var query = {_id : cart_id, user : userId, cart_status : Cart.In_Cart}
    try{
        CartModel.findOne(query).then(data =>{
            if(data){
                for(let id of item_id){
                    var checkIsKitItemExist = data.cart.findIndex(obj => (obj.item == id && cart_status == 1));
                    if(checkIsKitItemExist !== -1){
                        data.cart.splice(checkIsKitItemExist, 1);
                    }
                }
                
                data.total_quantity = data.cart.reduce((acc, curr) => acc + curr.qty, 0); // 6;
                CartModel.findOneAndUpdate(query,data, options).then(is_create =>{
                    res.status(200).send({ success: true, message: 'Successfully item deleted from cart!' });
                }).catch(err =>{
                    res.status(201).send({status : false , message : err.name})
                })
            }
        }).catch(err =>{
            res.status(201).send({status : false , message : err.name})
        })
    }catch(err){
        res.status(201).send({status : false, message : err.name});
    }
})