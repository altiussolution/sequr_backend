const { departmentModel } = require("../models");
var {error_code} = require('../utils/enum.utils')



exports.createDepartment = (req, res) => {
    try {
        var newDepartment = new departmentModel(req.body);
        newDepartment.save(async(err) => {
            if (!err) {
                res.status(200).send({ success: true, message: 'Department Created Successfully!' });
            }
            else {
                const name = await departmentModel.findOne(({department_name :req.body.department_name, active_status : 1})).exec()
                const id = await departmentModel.findOne(({ department_id: req.body.department_id ,active_status : 1 })).exec()
                if(name){
                    console.log(name)
                var errorMessage = (err.code == error_code.isDuplication ? 'Department name already exists' : err)
                res.status(200).send({
                    success: false,
                    message: errorMessage
                });
            } else if (id){
                var errorMessage = (err.code == error_code.isDuplication ? 'Department id already exists' : err)
                res.status(200).send({
                    success: false,
                    message: errorMessage
                });
            }
        }
        });
    } catch (error) {
        res.status(201).send(error)
    }
}


exports.getDepartment = (req, res) => {
    var offset = parseInt(req.query.offset);
    var limit = parseInt(req.query.limit);
    var searchString = req.query.searchString;
    var query = (searchString ? { active_status: 1, $text: { $search: searchString } } : { active_status: 1 })
    try {
        departmentModel.find(query).skip(offset).limit(limit).then(department => {
            console.log(department)
            res.status(200).send({ success: true, data: department });
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
}

exports.updateDepartment = (req, res) => {
    try {
        departmentModel.findByIdAndUpdate(req.params.id, req.body).then(department => {
            res.status(200).send({ success: true, message: 'Department Updated Successfully!' });
        }).catch(error => {
            res.status(200).send({ success: false, error: error, message: 'An Error Occured' });
        })
    } catch (err) {
        res.status(200).send({ success: false, error: err, message: 'An Error Catched' });
    }
}

exports.deleteDepartment = (req,res) =>{
    try{
        departmentModel.findByIdAndUpdate(req.params.id, {active_status: 0}).then(department =>{
            res.status(200).send({ success: true, message: 'Department Deleted Successfully!' });
        }).catch(err =>{
            res.status(200).send({ success: false, message: 'Department Not Found' });
        })
    }
    catch(err){
        res.status(200).send({ success: false, error: err, message : 'An Error Catched' });  
    }
   
}
