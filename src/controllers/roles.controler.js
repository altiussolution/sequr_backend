const { rolesModel, userModel } = require("../models");
const {Permissions} = require("../utils/enum.utils")
const { createLog } = require('../middleware/crud.middleware')
var ObjectId = require('mongodb').ObjectID
const { ObjectID } = require('bson')

// Roles
exports.createRole = (async (req, res) => {
    try {
        const newRole = new rolesModel(req.body)
        var isRoleExist = await rolesModel.findOne({ $or: [{role_name : req.body.role_name},{role_id: req.body.role_id} ] }).exec()
        if(isRoleExist){
            const name = await rolesModel.findOne(({role_name: req.body.role_name ,active_status: 1 })).exec()
            const id = await rolesModel.findOne(({ role_id:req.body.role_id ,  active_status: 1 })).exec()
            if(name){
                res.status(200).send({
                    success: false,
                    message: 'Role name Already Exist'
                });
            }
         else   if(id){
                res.status(200).send({
                    success: false,
                    message: 'Role ID Already Exist'
                });
            }
        }
        else if(!isRoleExist){
            newRole.save(err=>{
                if (!err) {
                    res
                      .status(200)
                      .send({
                        success: true,
                        message: 'Role Created Successfully!'
                          })
                      createLog(req.headers['authorization'], 'Roles', 2)
                  }
            })
        }
       
    } catch (error) {
        res.send({status : false , message : error.name});
    }
})


exports.getRoles = ((req, res) => {
    var company_id = req.query.company_id
    try {
        rolesModel.find({ active_status: 1 , company_id: company_id, role_id : {$nin : ['$ SEQUR SUPERADMIN $', '$ SEQUR CUSTOMER $']} }, (err, roles) => {
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

// exports.deleteRole = (async (req, res) => {
//     try {
//         userModel.countDocuments({ role_id: req.params.id, active_status: 1 }, (err, count) => {
//             if (count == 0) {
//                 rolesModel.findByIdAndUpdate(req.params.id, { active_status: 0 }, (err, file) => {
//                     if (!err)
//                         res.status(200).send({
//                             status: true,
//                             message: 'Role deleted'
//                         });
//                     else {
//                         res.send(err.message);
//                     }
//                     createLog(req.headers['authorization'], 'Roles', 0)
//                 })
//             } else {
//                 res.status(200).send({
//                     status: false,
//                     message: `${count} Employees are in this Role`
//                 });
//             }
//         })
//     } catch (error) {
//         res.send({status : false , error : error.name});
//         console.log(error);
//     }
// })

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

exports.deleteRole = (req, res) => {
    try {
      rolesModel //(paste your model)
        .aggregate([
          //Find role id and active_status is 1
          {
            $match: {
              $and: [{ _id: ObjectId(req.params.id) }, { active_status: 1 }]
            }
          },
  
          //********************************** */
  
  
  
          // Get all refered documents
          // *** 1 ***
          {
            $lookup: {
              from: 'users', // model name
              localField: '_id',
              foreignField: 'role_id',
              as: 'user_doc' // name of the document contains all users
            }
          },
          // *** 2 ***
          
  
          //********************************** */
        ])
        .then(async doc => {
          //Push messages if there is any documents refered
          message = []
  
          //push message if there is any referenced document
          //********************************** */
  
  
          // *** 1 ***
          if (doc[0].user_doc.length > 0) {
            await message.push(
              'Please delete all the refered users by this role'
            )
          }
          // *** 2 ***
         
          //********************************** */
  
  
  
          // Check if any referenced document with active_status 1 is present id DB
          if (message.length > 0) {
            res.status(200).send({ success: true, message: message })
  
            // Delet the document if there is no any referenced document
          } else if (message.length == 0) {
            rolesModel
              .deleteOne({ _id: ObjectId(req.params.id), active_status: 1 })
              .then(roles => {
                res.status(200).send({
                  success: true,
                  message: 'Role Deleted Successfully!'
                })
                createLog(req.headers['authorization'], 'Role', 0)
              })
              .catch(err => {
                res
                  .status(200)
                  .send({ success: false, message: 'Role Not Found' })
              })
  
          
          }
        })
        .catch(err => {
          res.status(200).send({ success: false, message: 'Role Not Found' })
        })
    } catch (err) {
      res
        .status(200)
        .send({ success: false, error: err, message: 'An Error Catched' })
    }
  }
  

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
    var company_id  = req.query.company_id
    try {
        rolesModel.find({ active_status: 1,company_id: company_id, permission : {$exists:true}, $where:'this.permission.length>0' }, (err, roles) => {
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
query['company_id'] =  req.query.company_id

    rolesModel.find(query).then(roles =>{
        res.status(200).send({ success: true,roles: roles });
    }).catch(error => {
        res.status(400).send({success: false, error : error})
    })

}