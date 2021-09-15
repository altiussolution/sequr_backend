const {kitModel} =  require("../models");

exports.createKit = (async (req,res) =>{
    var body = req.body;
    try{
        parseKitData  = JSON.parse(body.kit_data)
        if(parseKitData instanceof Error){
            console.log(parseKitData)
           throw err
        }
        body.kit_data = parseKitData
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
        console.log('error logged')
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
    try{
        kitModel.find(query).skip(offset).limit(limit).then(kits =>{
            for(let kit of kits){
               var quantity = kit.kit_data.reduce((acc, curr) => acc + curr.qty, 0); // 6
               binDatas.push({
                kit_name : kit.kit_name,
                available_item : kit.kit_data.length,
                total_qty : quantity
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
    body.kit_data = JSON.parse(body.kit_data)
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
          res.status(200).send({message : 'Kin Image Added Sucessfully', Path : `${req.file.destination}/${filename}`})
        }
      }catch (err) {
        res.status(400).send(err);
      }
})