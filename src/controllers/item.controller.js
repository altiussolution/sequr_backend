const { itemModel , stockAllocationModel} = require("../models");
const { appRouteModels } = require('../utils/enum.utils');


exports.addItem = (async (req, res) => {
    try {
        var newItem = new itemModel(req.body);
        newItem.save(function (err) {
            if (err) {
                res.status(200).send({
                    success: false,
                    message: 'error in adding item'
                });
            }
            else {
                res.status(200).send({ success: true, message: 'Item Added Successfully!' });
            }
        });
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})

exports.getItem = (req, res) => {
    var offset = req.query.offset != undefined ? parseInt(req.query.offset) : false;
    var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false;
    var searchString = req.query.searchString;
    var query = (searchString ? { active_status: 1, $text: { $search: searchString } } : { active_status: 1 })
    try {
        itemModel.find(query).populate('category_id').populate('sub_category_id').populate('supplier.suppliedBy').skip(offset).limit(limit).then(item => {
            res.status(200).send({ success: true, item: item })
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
}

exports.updateItem = (async (req, res) => {
    try {
        itemModel.findByIdAndUpdate(req.params.id, req.body, (err, file) => {
            if (file)
                res.send({
                    status: 'Success',
                    message: 'item Updated'  
                });
            else {
                res.send({message : 'Not Found'});
            }
        });
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})

exports.upload = (async (req, res) => {
    try {
        var fileLocations = {}
        if (req.files) {
            if (req.files.length === 2 && req.files[0].mimetype.startsWith('image') && req.files[1].mimetype.startsWith('video')) {
                 fileLocations['image_path'] = `${req.files[0].destination.replace('./src/public/', appRouteModels.BASEURL)}/${req.files[0].originalname}`
                 fileLocations['video_path'] = `${req.files[1].destination.replace('./src/public/', appRouteModels.BASEURL)}/${req.files[1].originalname}`
            }

            else if (req.files.length === 1 && req.files[0].mimetype.startsWith('image')) {
                 fileLocations['image_path'] = `${req.files[0].destination.replace('./src/public/', appRouteModels.BASEURL)}/${req.files[0].originalname}`
            }
            else if (req.files.length === 1 && req.files[0].mimetype.startsWith('video')) {
                 fileLocations['video_path'] = `${req.files[0].destination.replace('./src/public/', appRouteModels.BASEURL)}/${req.files[0].originalname}`
            }
            else {
                 fileLocations['image_path'] = `${req.files[1].destination.replace('./src/public/', appRouteModels.BASEURL)}/${req.files[1].originalname}`
                 fileLocations['video_path'] = `${req.files[0].destination.replace('./src/public/', appRouteModels.BASEURL)}/${req.files[0].originalname}`
            }

            res.status(200).send({
                message: 'Profile Added Sucessfully',
                fileLocations: fileLocations
            })
        }

    } catch (err) {
        res.status(400).send(err);
    }

})
 
exports.getItemByCategory = (async (req,res) =>{
    try{
        var itemsInCategory =  await itemModel.find({active_status : 1, is_active: true, category_id : req.params.category_id,sub_category_id : req.params.sub_category_id}).populate('supplier.suppliedBy').exec();
        res.status(200).send({data : itemsInCategory})
    }catch(err) {
        res.status(400).send(err);
    }
})
  
exports.getItemById = (async (req,res) =>{
    try{
        var item = req.params.item;
        var itemDetails = await itemModel.findById(item).exec()
        var stockDetails = await stockAllocationModel.findOne({item:item}).populate('cube').populate('bin').populate('compartment')
        res.status(200).send({status : true, items : itemDetails, machine : stockDetails ? stockDetails : false})

    }catch(err){
        res.status(400).send({status : false , message : err.name});
    }
})

exports.deleteItems = (req, res) => {
    
    try {
        itemModel.findByIdAndUpdate(req.params.id, { active_status: 0 }).then(item => {
            res.status(200).send({ success: true, message: 'Item  Deleted Successfully!' });
        }).catch(err => {
            res.status(200).send({ success: false, message: 'Item Not Found' });
        })
    }
    catch (err) {
        res.status(200).send({ success: false, error: err, message: 'An Error Catched' });
    }

}


exports.getItemfilter = (req, res) => {
    var category_name = req.query.category_name;
    var sub_category_name= req.query.sub_category_name;
    var is_active = req.query.is_active;
    var is_gages = req.query.is_gages;
   
    if (category_name && sub_category_name && is_active && is_gages){
        var query = {category_name:category_name,sub_category_name :sub_category_name , is_active  : is_active ,is_gages:is_gages}
    }
    else if(category_name && sub_category_name && is_gages){
        var query = {category_name: category_name, sub_category_name : sub_category_name ,is_gages:is_gages }
    }
    else if( category_name && is_active  && sub_category_name){
        var query = { category_name: category_name ,  is_active : is_active ,sub_category_name : sub_category_name}
    }
    else if( sub_category_name  && is_active  && is_gages ){
        var query = {sub_category_name  : sub_category_name  , is_active : is_active ,is_gages :is_gages}
    }
    else if( category_name  && is_active && is_gages ){
        var query = {category_name  : category_name  , is_active :is_active ,is_gages :is_gages}
    }
    
    else if( category_name && sub_category_name){
        var query = {category_name:category_name , sub_category_name : sub_category_name}
    }                                                                                                     
    else if(category_name && is_gages){
        var query = { category_name :category_name ,is_gages:is_gages}
    }
    else if( category_name && is_active){
        var query = { category_name :category_name , is_active:is_active}
    }
    
    else if( sub_category_name && is_gages){
        var query = {sub_category_name : sub_category_name, is_gages:is_gages}
    }
    else if( sub_category_name && is_active ){
        var query = {sub_category_name : sub_category_name, is_active:is_active}
    }
    else if( is_active && is_gages){
        var query = { is_active :is_active,is_gages:is_gages  }
    }
    else if( is_gages ){
        var query = { is_gages :is_gages}
    }
    else if(category_name ){
        var query = {category_name :category_name}
    }
    else if( sub_category_name ){
        var query = { sub_category_name :sub_category_name}
    }
    else if( is_active ){
        var query = {  is_active: is_active}
    }
        try {
            itemModel.find(query).populate('category_id').populate('sub_category_id').then(item => {
                res.status(200).send({ success: true, item: item })
            }).catch(error => {
                res.status(400).send({ success: false, error: error })
            })
        } catch (error) {
            res.status(201).send({ success: false, error: error })
        }
    }

    exports.uploadImage = (async(req,res) => {
        
        try {
            totalImages = []
            for(let image of req.files){
                fileLocations = {}
                fileLocations['image_path'] = `${image.destination.replace('./src/public/', appRouteModels.BASEURL)}/${image.originalname}`
                totalImages.push(fileLocations)
            }
            res.status(200).send({
                message: 'Profile Added Sucessfully',
                fileLocations: totalImages
            })

    
        } catch (err) {
            res.status(400).send(err);
        }
    
    })