const RoleSchema = require('../models/roles.model');

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
    var roles = {}
    roles.role_name = req.body.role_name;
    roles.permission = req.body.permission;
    RoleSchema.findByIdAndUpdate({ _id: body._id }, roles).then(roleUpdate => {
        res.status(200).send({ 
            status:'Success',
            message: 'Permissions updated sucessfully'
        })
    }).catch(error => {
        res.status(400).send(error)
    })
})