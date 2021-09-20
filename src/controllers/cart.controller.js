const {CartModel,itemModel,stockAllocationModel} = require('../models');
const AddCart  = require("../services/cart.services")
const {Cart} = require("../utils/enum.utils")

exports.addToCart = ((req,res) => {
    var body = req.body;
    var options = { upsert: true, new: true, setDefaultsOnInsert: true };
    stockAllocationModel.findOne({item : body.item},['_id','quantity']).then(async isQuantity =>{ //, quantity : {$gte: body.qty}
        if(!isQuantity){
            res.status(200).send({status : true , message : `Stock Not Yet Allocated`})
        }
        else if(body.qty > isQuantity.quantity){
            res.status(200).send({status : true , message : `Available quantity for this item is ${isQuantity.quantity}`})
        }else{
            var productId = body.item;
            var product = await itemModel.findById(productId).exec()
            CartModel.findOne({user : body.user}).then(CartData =>{
                var cart = AddCart(CartData ? CartData : body,body.item,isQuantity._id)
                console.log(cart);
                // CartModel.findOneAndUpdate({},cart, options).then(is_create =>{
                //     res.status(200).send({ success: true, message: 'Successfully added into cart!' });
                // }).catch(err =>{
                //     console.log('ann error on check qty 2',err)
                // })
            })
        }
    }).catch(err => {
        console.log('ann error on check qty',err)
    })
})