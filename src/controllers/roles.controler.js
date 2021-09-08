const RoleSchema = require('../models/roles.model');
var Models = require('../models/index')


exports.createRole = ((req, res) => {
    let body = req.body;
    console.log(body)
    var RoleModel = new RoleSchema;
    RoleModel.role_name = body.role_name;
    RoleModel.role_id = body.role_id;
    RoleModel.save().then(roleSave => {
        res.status(200).send({ Message: 'Role Created Sucessfully', roleSave })
    }).catch(error => {
        res.status(400).send(error)
    })
})

exports.updatePermission = ((req, res) => {
    let body = req.body;
    var id = req.params.id
    RoleSchema.findByIdAndUpdate({ _id: id }, body).then(roleUpdate => {
        res.status(200).send({
            status: 'Success',
            message: 'Permissions updated sucessfully'
        })
    }).catch(error => {
        res.status(400).send(error)
    })
})

exports.getRoles = ((req, res) => {
    RoleSchema.find({ active_status: 1 }, (err, roles) => {
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
})

exports.deleteRole = (async (req, res) => {
    Models.userModel.countDocuments({ role_id: req.body._id, active_status: 1 }, (err, count) => {
        if (count == 0) {
            RoleSchema.findByIdAndUpdate({ _id: req.body._id }, { active_status: 0 }, (err, file) => {
                if (!err)
                    res.status(200).send({
                        status: 'Success',
                        message: 'Role deleted'
                    });
                else {
                    res.send(err.message);
                }
            })
        } else {
            res.status(200).send({
                status: 'Failed',
                message: `${count} Employees are in this Role`
            });
        }
    })
})
