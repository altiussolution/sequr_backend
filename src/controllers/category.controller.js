<<<<<<< HEAD
const { result } = require('lodash');
const {categoryModel,subCategoryModel,itemModel} = require('../models')
=======
const {categoryModel,subCategoryModel} = require('../models')
>>>>>>> 1495c43948e75b9bf8677bf5be73d9edbfc0c138
var {error_code,appRouteModels} = require('../utils/enum.utils')
exports.addCategory = (async (req, res) => {
   try{
       var category = new categoryModel(req.body);
       var isCategoryExist = await categoryModel.findOne({ $or: [{category_name : req.body.category_name},{category_code: req.body.category_code} ] }).exec()
       if(!isCategoryExist){
        category.save((err) =>{  
            if(!err){
                res.status(200).send({ success: true, message: 'Category Created Successfully!' });
            }else{
                var errorMessage = (err.code == error_code.isDuplication ? 'Duplication occured in Category code or name' : err)
                res.status(200).send({
                    success: false,
                    message: errorMessage
                });
            }
           })
       }else{
        res.status(200).send({
            success: false,
            message: 'Givven Category Already Exist'
        });

       }
      
   }catch(err){
    res.status(201).send({success: false, error : err.name})
   }
})

exports.getCategory = (async (req, res) => {
    var offset = req.query.offset != undefined ? parseInt(req.query.offset) : false;
    var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false;
    var searchString = req.query.searchString
    var query = (searchString ? {active_status: 1, $text: {$search: searchString}} : {active_status: 1})
    try{
        categoryModel.find(query).skip(offset).limit(limit).then(categories =>{
            res.status(200).send({ success: true, data: categories });
        }).catch(error => {
            res.status(400).send({success: false, error : error})
        })
    } catch(error){
        res.status(201).send({success: false, error : error})
    }
})

exports.updateCategory = (async (req, res) => {
    try{
        categoryModel.findByIdAndUpdate(req.params.id, req.body).then(binUpdate =>{
            res.status(200).send({ success: true, message: 'Category Updated Successfully!' });
        }).catch(error =>{
            res.status(200).send({ success: false, error: error, message : 'An Error Occured' });
        }) 
    }catch(err){
        res.status(200).send({ success: false, error: err, message : 'An Error Catched' });  
    }
})

exports.upload = (async(req,res) => {
    try{
      if(req.file){
        var filename = req.file.originalname
        res.status(200).send({message : 'Category Image Sucessfully', Path : `${req.file.destination.replace('./src/public/',appRouteModels.BASEURL)}/${filename}`})
      }
    }catch (err) {
      res.status(400).send(err);
    }
})

exports.deleteCategory = (async(req,res) =>{
    try{
        var catId = req.params.id;
        categoryModel.deleteOne({_id : catId}).then(result =>{
            if(result.deletedCount){
                subCategoryModel.deleteMany({},{category_id :catId }).then(subResult =>{
                    itemModel.deleteMany({},{category_id :catId }).then(itemRestul =>{
                        res.status(200).send({status : true, message : 'Category and all the references were deleted'})
                    })
                })
            }else{
                res.status(200).send({status : true, message : 'Category not found'})
            }
           
        }).catch(err=>{
            console.log(err,'catch error')
        })
    }catch(err){
        res.status(400).send(err);
    }
})

exports.getCategorylist = (async (req, res) => {
    var query = {active_status : 1}
    var categories = []
    try{
        await categoryModel.find(query).then(async category =>{
            for (let cat of category){

            await subCategoryModel.find({category_id : cat._id}).then(subCategory =>{
                    categories.push({...cat , ...subCategory})
                })
            }
            ///////console.log(categories)
           res.status(200).send({ success: true, data: categories });
        }).catch(error => {
            res.status(400).send({success: false, error : error})
        })
    } catch(error){
        res.status(201).send({success: false, error : error})
    }
})
