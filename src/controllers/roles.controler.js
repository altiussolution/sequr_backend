const { rolesModel, userModel } = require("../models");

exports.createRole = ((req, res) => {
    try {
        var newRole = new rolesModel(req.body);
        newRole.save(function (err) {
            if (err) {
                res.status(200).send({
                    success: false,
                    message: 'error in adding role'
                });
            }
            else {
                res.status(200).send({ success: true, message: 'Role Added Successfully!' });
            }
        });
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})

exports.updatePermission = ((req, res) => {
    try {
        rolesModel.findByIdAndUpdate({ _id: req.params.id }, req.body).then(roleUpdate => {
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
        rolesModel.find({ active_status: 1 }, (err, roles) => {
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
        userModel.countDocuments({ role_id: req.params.id, active_status: 1 }, (err, count) => {
            if (count == 0) {
                rolesModel.findByIdAndUpdate({ _id: req.params.id }, { active_status: 0 }, (err, file) => {
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
