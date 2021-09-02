const RoleSchema = require('../models/roles.model');

exports.createRole = ((req, res) => {
    let body = req.body;
    var RoleModel = new RoleSchema;
    RoleModel.role_name = body.role_name;
    RoleModel.role_id = body.role_id;
    RoleModel.save().then(roleSave =>{
        res.status(200).send({Message : 'Role Created Sucessfully', roleSave})
    }).catch(error =>{
        res.status(400).send(error)
    })
})

exports.updatePermission = ((req,res) =>{
    let body = req.body;
    var RoleModel = new RoleSchema;
    RoleModel.updateOne({_id : body.id }, body.permissions).then(roleUpdate => {
        console.log(roleUpdate)
    }).catch(error =>{
        res.status(400).send(error)
    })
})