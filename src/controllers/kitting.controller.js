const {kitModel, stockAllocationModel, CartModel} =  require("../models");
const cartModel = require("../models/cart.model");
var {appRouteModels,Cart} = require('../utils/enum.utils')

exports.createKit = (async (req,res) =>{
    var body = req.body;
    try{        
        var kit = new kitModel(body)
        var isKitExist = await kitModel.find({kit_name :body.kit_name}).exec()
        if(isKitExist.length == 0){
            kit.save((err) =>{
                if(!err){
                    res.status(200).send({ success: true, message: 'Kit Created Successfully!' });
                }else{
                    res.status(200).send({
                        success: false,
                        message: err
                    });
                }
            })
        
        }else{
            res.status(200).send({
                success: false,
                message: 'Kit Name already exist'
            });
        }
       
    }catch(err){
        console.log(err,'error logged')
        res.status(201).send({message : err.name})
    }
     
})

exports.getKit = ((req,res) =>{
    var offset = req.query.offset != undefined ? parseInt(req.query.offset) : false ;
    var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false ;
    var searchString = req.query.searchString
    var query = (searchString ? {active_status: 1, $text: {$search: searchString}} : {active_status: 1})
    var _ = require('lodash');
    var binDatas = []
    var allocationDetais;
    try{
        kitModel.find(query).skip(offset).limit(limit).then(async kits =>{
            for(let kit of kits){
               var quantity = kit.kit_data.reduce((acc, curr) => acc + curr.qty, 0); // 6
               for(let kitdata of kit.kit_data){
                   allocationDetais = await stockAllocationModel.find({category:kitdata.category_id, item:kitdata.item_id}).populate('item',['item_name']).populate('cube',['cube_name','cube_id']).populate('bin',['bin_name','bin_id']).populate('compartment',['compartment_name','compartment_id']).exec()
               }
                   binDatas.push({
                    _id : kit._id,
                    kit_name : kit.kit_name,
                    available_item : kit.kit_data.length,
                    total_qty : quantity,
                    kit_data : allocationDetais,
                    image_path : kit.image_path
                   })
            }
            if(kits.length == binDatas.length){
                res.status(200).send({success: true, data : binDatas})
            }
        }).catch(error => {
            res.status(400).send({success: false, error : error})
        })
    } catch(error){
        res.status(201).send({success: false, error : error})
    }
})

exports.updateKit = (async (req,res) =>{
    let body = req.body;
    try{
        var isKitExist = await kitModel.findOne({kit_name :  body.kit_name}).exec()
        if(!isKitExist || isKitExist._id == req.params.id){
            kitModel.findByIdAndUpdate(req.params.id,body).then(kitUpdate =>{
                res.status(200).send({ success: true, message: 'Kit Updated Successfully!' });
            }).catch(error =>{
                res.status(200).send({ success: false, error: error, message : 'An Error Occured' });
            }) 
        }else{
            res.status(200).send({ success: false, message : 'Kit Name Alreadey exist' });
        }     
    }catch(err){
        res.status(200).send({ success: false, error: err.name, message : 'An Error Catched' });  
    }
})
   
exports.deleteKit = ((req,res) =>{
    try{
        kitModel.findByIdAndUpdate(req.params.id, {active_status: 0}).then(kitDeactivate =>{
            res.status(200).send({ success: true, message: 'Kit Deactivated Successfully!' });
        }).catch(err =>{
            res.status(200).send({ success: false, message: 'Kit Not Found' });
        })
    }
    catch(err){
        res.status(200).send({ success: false, error: err.name, message : 'An Error Catched' });  
    }
})

exports.upload = ((req,res) =>{  
    try{
        if(req.file){
            var filename = req.file.originalname
          res.status(200).send({message : 'Kin Image Added Sucessfully', Path : `${req.file.destination.replace('./src/public/',appRouteModels.BASEURL)}/${filename}`})
        }
      }catch (err) {
        res.status(400).send(err);
      }
})

exports.addKitToCart = ((req,res) =>{
    var userId = req.user.user_id;
    var query = {user : userId, cart_status : Cart.In_Cart}
    var kit_id = req.params.kit_id
    var kitting;
    cartModel.findOne(query,['kitting']).then(isInCart =>{
        if(isInCart){
            if(isInCart.kitting.length == 0){
                isInCart.kitting.push({kit_id:kit_id})
            }else{
                var checkIsKitItemExist = isInCart.kitting.filter(obj => (obj.kit_id == kit_id));
                console.log(checkIsKitItemExist)
            }
            console.log(isInCart);
        }
    })
})