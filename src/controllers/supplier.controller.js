const { supplierModel } = require("../models");
var {error_code} = require('../utils/enum.utils')

exports.createSupplier = (req, res) => {
    try {
        var newSupplier = new supplierModel(req.body);
        newSupplier.save((err) => {
            if (!err) {
                res.status(200).send({ success: true, message: 'Supplier Created Successfully!' });
            }
            else {
                var errorMessage = (err.code == error_code.isDuplication ? 'Duplication occured in Supplier name or code' : err)
                res.status(200).send({
                    success: false,
                    message: errorMessage
                });
            }
        });
    } catch (error) {
        res.status(201).send(error)
    }
}


exports.getSupplier = (req, res) => {
    var offset = parseInt(req.query.offset);
    var limit = parseInt(req.query.limit);
    var searchString = req.query.searchString;
    var query = (searchString ? { active_status: 1, $text: { $search: searchString } } : { active_status: 1 })
    try {
        supplierModel.find(query).populate("country_id").populate("state_id").populate("city_id").skip(offset).limit(limit).then(supplier => {
            res.status(200).send({ success: true, data: supplier });
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
}



exports.updateSupplier = (req, res) => {
    try {
        supplierModel.findByIdAndUpdate(req.params.id, req.body).then(supplier => {
            res.status(200).send({ success: true, message: 'Supplier Updated Successfully!' });
        }).catch(error => {
            res.status(200).send({ success: false, error: error, message: 'An Error Occured' });
        })
    } catch (err) {
        res.status(200).send({ success: false, error: err, message: 'An Error Catched' });
    }
}

exports.deleteSupplier = (req, res) => {
    
    try {
        supplierModel.findByIdAndUpdate(req.params.id, { active_status: 0 }).then(supplier => {
            res.status(200).send({ success: true, message: 'Supplier Deleted Successfully!' });
        }).catch(err => {
            res.status(200).send({ success: false, message: 'Supplier Not Found' });
        })
    }
    catch (err) {
        res.status(200).send({ success: false, error: err, message: 'An Error Catched' });
    }

}

exports.getSupplierfilter = (req, res) => {


    var country_id = req.query.country_id;
    var state_id  = req.query.state_id;
    var city_id  = req.query.city_id;
    var status = req.query.status;

    if (country_id && state_id && city_id && status){
        var query = {country_id:country_id,state_id :state_id , city_id  : city_id ,status:status}
    }
    else if(country_id && state_id && status){
        var query = {country_id: country_id, state_id : state_id ,status:status }
    }
    else if( country_id && city_id  && state_id){
        var query = { country_id: country_id ,  city_id : city_id ,state_id : state_id}
    }
    else if( state_id  && city_id  && status ){
        var query = {state_id  : state_id  , city_id : city_id ,status :status}
    }
    else if( country_id  && city_id && status ){
        var query = {country_id  : country_id  , city_id :city_id ,status :status}
    }
    
    else if( country_id && state_id){
        var query = {country_id:country_id , state_id : state_id}
    }                                                                                                     
    else if(country_id && status){
        var query = { country_id :country_id ,status:status}
    }
    else if( country_id && city_id){
        var query = { country_id :country_id , city_id:city_id}
    }
    
    else if( state_id && status){
        var query = {state_id : state_id, status:status}
    }
    else if( state_id && city_id ){
        var query = {state_id : state_id, city_id:city_id}
    }
    else if( city_id && status){
        var query = { city_id :city_id,status:status  }
    }
    else if( status ){
        var query = { status :status}
    }
    else if(country_id ){
        var query = {country_id :country_id}
    }
    else if( state_id ){
        var query = { state_id :state_id}
    }
    else if( city_id ){
        var query = {  city_id: city_id}
    }
    try {
        supplierModel.find(query).populate("country_id").populate("state_id").populate("city_id").then(supplier => {
            res.status(200).send({ success: true, data: supplier });
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
}