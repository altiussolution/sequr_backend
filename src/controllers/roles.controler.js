const RoleSchema = require('../models/roles.model');
var Models = require('../models/index')


exports.createRole = ((req, res) => {
    try {
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
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})

exports.updatePermission = ((req, res) => {
    try {
        RoleSchema.findByIdAndUpdate({ _id: req.params.id }, req.body).then(roleUpdate => {
            res.status(200).send({
                status: 'Success',
                message: 'Permissions updated sucessfully'
            })
        }).catch(error => {
            res.status(400).send(error)
        })
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})

exports.getRoles = ((req, res) => {
    try {
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
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})

exports.deleteRole = (async (req, res) => {
    try {
        Models.userModel.countDocuments({ role_id: req.params.id, active_status: 1 }, (err, count) => {
            if (count == 0) {
                RoleSchema.findByIdAndUpdate({ _id: req.params.id }, { active_status: 0 }, (err, file) => {
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
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})
