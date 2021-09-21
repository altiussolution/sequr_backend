const {CartModel,itemModel,stockAllocationModel} = require('../models');
const AddCart  = require("../services/cart.services")
const {Cart} = require("../utils/enum.utils")

exports.addToCart = ((req,res) => {
    var body = req.body;
    var userId = req.user.user_id;
    var options = { upsert: true, new: true, setDefaultsOnInsert: true };
    var query = {user : userId, cart_status : Cart.In_Cart}
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
            })
        }
    }).catch(err => {
        res.status(201).send({status : false , message : err.name})
    })
})

exports.updateCart = (async (req,res) =>{
    try{
        var cartId = req.params.id;
        var qty = req.body.qty;
        var itemId = req.body.item;
        var userId = req.user.user_id;
        var allocation = req.body.allocation
        var cart_status = req.body.cart_status
        var cartUpdate;
        var cart_delete = req.body.cart_delete;
        var isErrResponse = false
        
        var data = await CartModel.findOne({_id : cartId, user : userId, status : 1}).exec() //, cart_status : Cart.In_Cart
        if(!data){
            isErrResponse = true;
            res.status(200).send({message : 'Cart not found or Deleted'})
        }
        else if(qty){
            if(data.cart_status != Cart.In_Cart){
                isErrResponse = true;
                var message = data.cart_status == Cart.Kept ? 'Already Kept Inside' : 'Already Taken'
                res.status(200).send({message : message})
            }else{
                cartUpdate = AddCart(
                    {
                        cartData : data,
                        item:itemId,
                        allocation : allocation,  
                        userQty : qty, 
                        updateQty : true
                    }
                )
            }
        }else if(cart_status){
            cartUpdate = {cart_status : cart_status}
        }else if(cart_delete){
            if(data.cart_status > Cart.In_Cart){
                isErrResponse = true;
                var message = data.cart_status == Cart.Kept ? 'Already Kept Inside You Cant Delete' : 'Already Taken You Cant Delete'
                res.status(200).send({message : message})
            }else{
                cartUpdate = {status : 0}
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