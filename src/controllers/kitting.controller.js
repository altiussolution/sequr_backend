const {kitModel} =  require("../models");

exports.createKit = (async (req,res) =>{
    var samplDate = '[{"category_id":"61370939e41b121931d5a408","item_id":"613843b8576e25cb1f0b44f5","qty":1,"description":"Sample developer description"},{"category_id":"61370939e41b121931d5a408","item_id":"613850d1217e9ffd5db305f2","qty":1,"description":"Sample developer description"}]';
    var body = req.body;
    body.kit_data = (body.kit_data == "" ? JSON.parse(samplDate) : JSON.parse(body.kit_data))
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
        console.log('error logged')
        res.status(201).send('error occured')
    }
     
})

exports.getKit = ((req,res) =>{

})

exports.updateKit = ((req,res) =>{
    try{
        binModel.findByIdAndUpdate(req.params.id, req.body).then(binUpdate =>{
            res.status(200).send({ success: true, message: 'Bin Updated Successfully!' });
        }).catch(error =>{
            res.status(200).send({ success: false, error: error, message : 'An Error Occured' });
        }) 
        
    }catch(err){
        res.status(200).send({ success: false, error: err, message : 'An Error Catched' });  
    }
})

exports.deleteKit = ((req,res) =>{
    
})