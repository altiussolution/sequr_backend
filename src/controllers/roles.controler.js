const { rolesModel, userModel } = require("../models");
const {Permissions} = require("../utils/enum.utils")
const { createLog } = require('../middleware/crud.middleware')

// Roles
exports.createRole = (async (req, res) => {
    try {
        let body = req.body
        var isRoleExist = await rolesModel.find({ $or: [{role_name : body.role_name},{role_id: body.role_id} ] }).exec()
        if(isRoleExist.length == 0){
            var newRole = new rolesModel(req.body);
            newRole.save(function (err) {
                if (err) {
                    res.status(200).send({
                        success: false,
                        message: 'error in adding role',
                        error : err
                    });
                }
                else {
                    res.status(200).send({ success: true, message: 'Role Added Successfully!' });
                    createLog(req.headers['authorization'], 'Roles', 2)
                }
            });
        }else{
            res.status(200).send({ success: false, message: 'Role Duplication occured' });
        }
       
    } catch (error) {
        res.send({status : false , message : error.name});
    }
})

exports.getRoles = ((req, res) => {
    try {
        rolesModel.find({ active_status: 1 }, (err, roles) => {
            if (!err) {
                res.status(200).send({
                    status: true,
                    roles: roles
                });
            }
            else {
                res.send(err.message);
            }
        })
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})

exports.deleteRole = (async (req, res) => {
    try {
        userModel.countDocuments({ role_id: req.params.id, active_status: 1 }, (err, count) => {
            if (count == 0) {
                rolesModel.findByIdAndUpdate(req.params.id, { active_status: 0 }, (err, file) => {
                    if (!err)
                        res.status(200).send({
                            status: true,
                            message: 'Role deleted'
                        });
                    else {
                        res.send(err.message);
                    }
                    createLog(req.headers['authorization'], 'Roles', 0)
                })
            } else {
                res.status(200).send({
                    status: false,
                    message: `${count} Employees are in this Role`
                });
            }
        })
    } catch (error) {
        res.send({status : false , error : error.name});
        console.log(error);
    }
})

exports.updateRole = ((req, res) => {
    try {
        rolesModel.findByIdAndUpdate(req.params.id, req.body).then(roleUpdate => {
            res.status(200).send({
                status: 'Success',
                message: 'Role updated sucessfully'
                
            })
            createLog(req.headers['authorization'], 'Roles', 1)
        }).catch(error => {
            res.status(400).send({status : false, error : error, message : "Error Occured"})
        })
    } catch (error) {
        res.send({status : false , error : error.name});
    }
})

// Permissions
exports.addPermission = ((req, res) => {
    try {
        rolesModel.findByIdAndUpdate(req.params.id, req.body).then(roleUpdate => {
            res.status(200).send({
                status: 'Success',
                message: 'Permissions added sucessfully'
            })
            createLog(req.headers['authorization'], 'Permission', 2)
        }).catch(error => {
            res.status(400).send(error)
        })
    } catch (error) {
        res.send({status : false , error : error.name});
    }
})



exports.updatePermission = ((req, res) => {
    try {
        rolesModel.findByIdAndUpdate(req.params.id, req.body).then(roleUpdate => {
            res.status(200).send({
                status: 'Success',
                message: 'Permissions updated sucessfully'
            })
            createLog(req.headers['authorization'], 'Permission', 1)
        }).catch(error => {
            res.status(400).send(error)
        })
    } catch (error) {
        res.send({status : false , error : error.name});
    }
})

exports.getPermission = ((req, res) => {
    try {
        rolesModel.find({ active_status: 1, permission : {$exists:true}, $where:'this.permission.length>0' }, (err, roles) => {
            if (!err) {
                res.status(200).send({
                    status: 'Success',
                    roles: roles
                });
            }
            else {
                res.send(err.message);
            }
        })
    } catch (error) {
        res.send({status : false , error : error.name});
    }
})

exports.deletePermission = (async (req, res) => {
    try {
        rolesModel.findByIdAndUpdate(req.params.id, { $unset: { permission: "" } }, (err, file) => {
            if (!err)
                res.status(200).send({
                    status: 'Success',
                    message: 'Permission deleted'
                });
            else {
                res.send(err.message);
            }
            createLog(req.headers['authorization'], 'Permission', 0)
        })

    } catch (error) {
        res.send({status : false , error : error.name});
    }
})

exports.listPermission = ((req,res) =>{
    delete Permissions.Employee;
    res.status(200).send(Permissions)
})

exports.getRolesfilter = (req, res) => {
    var role_name = req.query.role_name;
    var role_id = req.query.role_id;
    var active_status = req.query.active_status;
    
  if (role_name && role_id && active_status){
    var query = {role_name : role_name, role_id: role_id , active_status : active_status}
}
else if(role_name ){
    var query = {role_name : role_name}
}
else if( role_id ){
    var query = { role_id : role_id}
}
else if( active_status ){
    var query = { active_status :active_status}
}

    rolesModel.find(query).then(roles =>{
        res.status(200).send({ success: true,roles: roles });
    }).catch(error => {
        res.status(400).send({success: false, error : error})
    })

}