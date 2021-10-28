const { branchModel } = require("../models");
var { error_code } = require('../utils/enum.utils')



exports.createBranch = (req, res) => {
    try {
        var newBranch = new branchModel(req.body);
        newBranch.save((err) => {
            if (!err) {
                res.status(200).send({ success: true, message: 'Branch Created Successfully!' });
            }
            else {
                var errorMessage = (err.code == error_code.isDuplication ? 'Duplication occured in Branch name or code' : err)
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


exports.getBranch = (req, res) => {
    var offset = parseInt(req.query.offset);
    var limit = parseInt(req.query.limit);
    var searchString = req.query.searchString;
    var query = (searchString ? { active_status: 1, $text: { $search: searchString } } : { active_status: 1 })
    try {
        branchModel.find(query).populate("country_id").populate("state_id").populate("city_id").skip(offset).limit(limit).then(branch => {
            res.status(200).send({ success: true, data: branch });
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
}

exports.updateBranch = (req, res) => {
    try {
        branchModel.findByIdAndUpdate(req.params.id, req.body).then(branch => {
            res.status(200).send({ success: true, message: 'Branch Updated Successfully!' });
        }).catch(error => {
            res.status(200).send({ success: false, error: error, message: 'An Error Occured' });
        })
    } catch (err) {
        res.status(200).send({ success: false, error: err, message: 'An Error Catched' });
    }
}

exports.deleteBranch = (req, res) => {
    try {
        branchModel.findByIdAndUpdate(req.params.id, { active_status: 0 }).then(branch => {
            res.status(200).send({ success: true, message: 'Branch Deleted Successfully!' });
        }).catch(err => {
            res.status(200).send({ success: false, message: 'Branch Not Found' });
        })
    }
    catch (err) {
        res.status(200).send({ success: false, error: err, message: 'An Error Catched' });
    }

}

exports.getBranchfilter = (req, res) => {


    var country_id = req.query.country_id;
    var state_id  = req.query.state_id;
    var city_id  = req.query.city_id;



    if (country_id && state_id  && city_id){
        var query = {country_id : country_id, state_id  : state_id,city_id:city_id}
    }
    else if( country_id && state_id ){
        var query = { country_id: country_id,state_id : state_id }
    }
    else if( state_id  && city_id ){
        var query = {state_id   : state_id, city_id :city_id}
    }
    else if( country_id && city_id ){
        var query = {country_id  : country_id, city_id :city_id}
    }
                                                                                                         
    else if( country_id ){
        var query = { country_id :country_id}
    }
    
    else if(  city_id ){
        var query = { city_id : city_id  }
    }
    else if( state_id  ){
        var query = { state_id  :state_id }
    }
    try {
        branchModel.find(query).populate("country_id").populate("state_id").populate("city_id").then(branch => {
            res.status(200).send({ success: true, data: branch });
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
}