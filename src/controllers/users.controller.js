var { User } = require('../models/user.model')
var Models = require('../models/index')
const { appRouteModels } = require('../utils/enum.utils')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
const sendEmail = require('../middleware/sendmail.middleware')
const crypto = require('crypto')
const Joi = require('joi')
var generator = require('generate-password')
var fs = require('fs')
const Email = require('email-templates')
const { createLog } = require('../middleware/crud.middleware')
var ObjectId = require('mongodb').ObjectID
const { rolesModel } = require('../models')
var child_process = require('child_process');
const cartModel = require('../models/cart.model')
const storeModel = require('../models/store.model')
const stockAllocationModel = require('../models/stockAllocation.model')
const itemModel = require('../models/item.model')
const AddCart = require('../services/cart.services')
const { Cart } = require('../utils/enum.utils')
const AddKit = require('../services/kit.services')

exports.add = async (req, res) => {
  try {
    var password = generator.generate({
      length: 6,
      numbers: true
    })

    // var password  = '1q2w3e$R';
    const {
      first_name,
      last_name,
      email_id,
      contact_no,
      date_of_birth,
      role_id,
      language_prefered,
      employee_id,
      item_max_quantity,
      branch_id,
      shift_time_id,
      department_id,
      profile_pic,
      city_id,
      country_id,
      state_id,
      company_id,
      created_by,
      status,
      active_status
    } = req.body

    if (
      !(email_id && employee_id && first_name && role_id && language_prefered)
    ) {
      res.status(400).send('All input is required')
    }
    const oldEmployee_id = await User.findOne({
      employee_id,
      active_status: 1
      // company_id: req.body.company_id
    })
    const oldmobilenumber = await User.findOne({
      contact_no,
      active_status: 1
      // company_id: req.body.company_id
    })
    const oldemail_id = await User.findOne({
      email_id,
      active_status: 1
      // company_id: req.body.company_id
    })
    if (oldEmployee_id) {
      return res
        .status(409)
        .send({ status: false, message: 'Employee_id already exist' })
    }
    if (oldemail_id) {
      return res
        .status(409)
        .send({ status: false, message: 'Email id already exists' })
    }
    if (oldmobilenumber) {
      return res
        .status(409)
        .send({ status: false, message: 'Contact number already exists' })
    }
    console.log(password)
    encryptedPassword = await bcrypt.hash(password, 10)
    User.create({
      employee_id,
      first_name,
      last_name,
      contact_no,
      date_of_birth,
      role_id,
      language_prefered,
      item_max_quantity,
      branch_id,
      shift_time_id,
      department_id,
      profile_pic,
      country_id,
      city_id,
      state_id,
      company_id,
      created_by,
      status,
      email_id: email_id, // sanitize: convert email to lowercase
      password: encryptedPassword,
      active_status: 1
    })
      .then(async user => {
        const token = jwt.sign(
          {
            user_id: user._id,
            employee_id,
            company_id: user.company_id,
            role_id: user.role_id
          },
          process.env.TOKEN_KEY,
          {
            expiresIn: '24h'
          }
        )
        // role = await rolesModel

        // Get Customer Role and Super Admin Role
        isUserRole = await rolesModel.findOne({ _id: user.role_id }).exec()

        if (isUserRole.permission.length > 0) {
          if (isUserRole.permission.includes('admin') || isUserRole.permission.includes('subadmin')) {
            var loginPage = process.env.STAGING
            var template = '../src/templates/registerMail'
          } else {
            var template = '../src/templates/registerMailUser'
          }
        }
        console.log(loginPage)
        const hostname =
          process.env['USER'] == 'ubuntu' ? '172.31.45.190' : 'localhost'
        const locals = {
          employee_id: employee_id,
          password: password,
          loginPage: loginPage,
          logo: `${appRouteModels.BASEURL}/mailAssets/logobg.png`,
          background: `${appRouteModels.BASEURL}/mailAssets/bgbg.jpg`
        }
        user.token = token
        const email = new Email()
        Promise.all([
          email.render(template, locals)
        ]).then(async registerMail => {
          //console.log(registerMail[0])
          await sendEmail(email_id, 'New User Signup', registerMail[0])
        })
        res.status(201).json(user)
        createLog(req.headers['authorization'], 'Employee', 2)
      })
      .catch(error => {
        console.log(error)

        if (error.code == 11000) {
          res.status(422).send({
            success: false,
            message: tiltelCase(
              `${Object.keys(err.keyPattern)[0].replace(
                '_',
                ' '
              )} already exist`
            )
          })
        }
      })
  } catch (err) {
    console.log(err)
  }
}
exports.login = async (req, res) => {
  try {
    const { employee_id, password } = req.body
    if (!(employee_id && password)) {
      res.status(400).send({ status: false, message: 'All input is required' })
    }

    const user = await User.findOne({ employee_id })
      .populate('role_id')
      .populate('country_id')
      .populate('state_id')
      .populate('city_id')
      .populate('company_id')
      .exec()

    if (
      user &&
      (await bcrypt.compare(password, user.password)) &&
      user.active_status &&
      user.company_id.status
    ) {
      const token = jwt.sign(
        {
          user_id: user._id,
          employee_id,
          company_id: user.company_id._id,
          role_id: user.role_id._id
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: '24h'
        }
      )

      user.token = token

      res.status(200).json(user)
      //kitdetails()
// cartdetails()
 //kitdetailsadd()
 //cartdetailsadd()
//kitdetailsadd1()
// child_process.exec('sh script.sh /home/ubuntu/scripts', function(error, stdout, stderr){
  
//     console.log(stdout);
//     console.log(stderr);
//     console.log(error);
// });
} else {
      res.status(400).send({
        statue: false,
        message: 'Invalid Credentials or No user found'
      })
    }
  } catch (err) {
    console.log(err)
  }
}

// exports.upload = async (req, res) => {
//   try {
//     if (req.file) {
//       var filename = `${req.user.user_id}.${req.file.originalname
//         .split('.')
//         .pop()}`
//       res.status(200).send({
//         message: 'Profile Added Sucessfully',
//         Path: `${req.file.destination.replace(
//           './src/public/',
//           appRouteModels.BASEURL
//         )}/${filename}`
//       })
//     }
//   } catch (err) {
//     res.status(400).send(err.name)
//   }
// }
exports.upload = async (req, res) => {
  console.log(req.file)
  try {
    if (req.file) {
      const filename = req.file.filename
      res.status(200).send({
        Message: 'Image Added Sucessfully',
        Path: `${req.file.destination.replace(
          './src/public/',
          appRouteModels.BASEURL
        )}/${filename}`
      })
    }
  } catch (err) {
    res.status(400).send(err)
  }
}

exports.update = async (req, res) => {
  try {
    var userId = ObjectId(req.params._id)
    var updateUser = req.body
    User.updateOne(
      { _id: userId, active_status: 1 },
      updateUser,
      (err, isExist) => {
        if (isExist) {
          res.status(200).send({ message: 'Employee Updated Sucessfully' })
          createLog(req.headers['authorization'], 'Employee', 1)
        } else if (err) {
          if (err.code == 11000) {
            res.status(422).send({
              success: false,
              message: tiltelCase(
                `${Object.keys(err.keyPattern)[0].replace(
                  '_',
                  ' '
                )} already exist`
              )
            })
          }
        }
      }
    )
  } catch (err) {
    res.status(400).send(err)
  }
}

exports.deleteUser = (req, res) => {
  try {
    User.deleteOne({ _id: req.params._id }, function (err, branch) {
      if (!err) {
        res.status(200).send({
          success: true,
          message: 'Employee Deleted Successfully!'
        })
        createLog(req.headers['authorization'], 'Employee', 0)
      } else {
        res
          .status(200)
          .send({ success: false, message: 'error in deactivating employee' })
      }
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

exports.listEmployees = async (req, res) => {
  try {
    var offset =
      req.query.offset != undefined ? parseInt(req.query.offset) : false
    var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
    var searchString = req.query.searchString
    var role_id = req.query.role_id
    var branch_id = req.query.branch_id
    var status = req.query.status
    var department_id = req.query.department_id
    var shift_time_id = req.query.shift_time_id
    var company_id = req.query.company_id
    var created_by = req.query.created_by

    var query = searchString
      ? {
          active_status: 1,
          company_id: company_id,
          $text: { $search: searchString }
        }
      : { active_status: 1, company_id: company_id }
    if (role_id) {
      query['role_id'] = role_id
    } else {
      // Get Customer Role and Super Admin Role
      customerRole = await rolesModel
        .distinct('_id', {
          role_id: { $in: ['$ SEQUR SUPERADMIN $', '$ SEQUR CUSTOMER $'] }
        })
        .exec()
      query['role_id'] = { $nin: customerRole }
    }
    if (branch_id) query['branch_id'] = branch_id
    if (department_id) query['department_id'] = department_id
    if (status) query['status'] = status
    if (shift_time_id) query['shift_time_id'] = shift_time_id
    if (created_by) query['created_by'] = created_by

    User.find(query)
      .populate('department_id')
      .populate('country_id')
      .populate('state_id')
      .populate('city_id')
      .skip(offset)
      .limit(limit)
      .then(result => {
        res.send(result)
      })
  } catch (err) {
    res.status(400).send(err)
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const schema = Joi.object({
      email_id: Joi.string()
        .email()
        .required()
    })
    // const { error } = schema.validate(req.body)
    // if (error) return res.status(400).send(error.details[0].message)

    const user = await Models.userModel.findOne({ email_id: req.body.email_id })
    if (!user)
      return res
        .status(409)
        .send({ status: false, message: 'Please Enter Register Email ID' })

    let token = await Models.resetPasswordTokenModel.findOne({
      user_id: user._id
    })
    if (!token) {
      token = await new Models.resetPasswordTokenModel({
        user_id: user._id,
        token: crypto.randomBytes(32).toString('hex')
      }).save()
    }

    const link = `${process.env.STAGING}/reset?id=${user._id}&token=${token.token}`
    // await sendEmail(user.email_id, 'Password reset', link)

    const locals = {
      forgotPageLink: link,
      adminName: `${user.first_name} ${user.last_name}`,
      logo: `${appRouteModels.BASEURL}/mailAssets/logobg.png`,
      background: `${appRouteModels.BASEURL}/mailAssets/bgbg.jpg`
    }
    const email = new Email()
    Promise.all([
      email.render('../src/templates/employeeNewPassword', locals)
    ]).then(async adminForgotPassword => {
      await sendEmail(user.email_id, 'Password reset', adminForgotPassword[0])
    })

    res.status(200).send({
      success: true,
      message: 'Password Reset Link Sent To Your Email Account'
    })
  } catch (error) {
    res.send('An error occured')
    console.log(error)
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const schema = Joi.object({ password: Joi.string().required() })
    const { error } = schema.validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await Models.userModel.findById(req.params.user_id)
    if (!user)
      return res.status(400).send({
        success: false,
        message: 'Invalid link or expired'
      })

    const token = await Models.resetPasswordTokenModel.findOne({
      user_id: user._id,
      token: req.params.token
    })
    if (!token)
      return res.status(400).send({
        success: false,
        message: 'Invalid link or expired'
      })

    user.password = await bcrypt.hash(req.body.password, 10)
    await user.save()
    await token.delete()

    res.status(200).send({
      success: true,
      message: 'Password Reset Sucessfully'
    })
  } catch (error) {
    res.send('An error occured')
    console.log(error)
  }
}

exports.userProfile = async (req, res) => {
  var userId = req.params._id
  var company_id = req.query.company_id
  try {
    var userDetails = await User.findOne({
      _id: userId,
      active_status: 1,
      status: true
      // company_id : company_id
    })
      .populate('language_prefered')
      .populate('city_id')
      .populate('state_id')
      .populate('country_id')
      .exec()
    console.log(userDetails)
    if (userDetails) {
      res.status(200).send({ status: true, data: userDetails })
    } else {
      res.status(201).send({ status: false, message: 'Not a valid User' })
    }
  } catch (err) {
    res
      .status(200)
      .send({ success: false, error: err.name, message: 'An Error Catched' })
  }
}
exports.EmployeeForgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      email_id: req.body.email_id
    })
    if (!user)
      return res.status(400).send("user with given email doesn't exist")

    let newPassword = await generator.generate({
      length: 6,
      numbers: true
    })

    // template = `${process.env.STAGING_USER} \n New Password : ${newPassword}`
    // await sendEmail(user.email_id, 'New Password', template)

    const locals = {
      newPassword: newPassword,
      loginPage: process.env.STAGING_USER,
      userName: `${user.first_name} ${user.last_name}`,
      logo: `${appRouteModels.BASEURL}/mailAssets/logobg.png`,
      background: `${appRouteModels.BASEURL}/mailAssets/bgbg.jpg`
    }
    const email = new Email()
    Promise.all([
      email.render('../src/templates/adminForgotPassword', locals)
    ]).then(async employeeNewPassword => {
      await sendEmail(user.email_id, 'New Password', employeeNewPassword[0])
    })

    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    await User.findByIdAndUpdate(req.body.id, {
      password: encryptedPassword,
      new_pass_req: false
    }).exec()
    res.send('new password sent to employee email account')
  } catch (error) {
    res.send('An error occured')
    console.log(error)
  }
}

exports.changePassword = async (req, res) => {
  // try {
  var passwordDetails = req.body
  console.log(req.body)
  var userId = req.params._id
  console.log(userId)
  if (userId) {
    if (passwordDetails.newpassword) {
      await User.findOne({ _id: userId }, async function (err, user) {
        console.log(user)
        if (!err && user) {
          //console.log(user.authenticate(passwordDetails.oldpassword));
          var compare = await bcrypt.compare(
            passwordDetails.oldpassword,
            user.password
          )
          console.log(compare)
          if (user && compare) {
            user.password = await bcrypt.hash(passwordDetails.newpassword, 10)
            //const user = await User.findOne({ employee_id });

            user.save(function (err) {
              if (err) {
                return res.status(422).send({
                  message: errorHandler.getErrorMessage(err)
                })
              } else {
                //req.login(user, function (err) {
                // console.log(user)
                //if (err) {
                //res.status(400).send(err);
                //  } else {
                res.send({
                  message: 'Password changed successfully'
                })
                //  }
                // });
              }
            })
          } else {
            res.status(422).send({
              message: 'Current password is incorrect'
            })
          }
        } else {
          res.status(400).send({
            message: 'User is not found'
          })
        }
      })
    } else {
      res.status(422).send({
        message: 'Please provide a new password'
      })
    }
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    })
  }
  // } catch (err) {
  //   res.status(400).send(err)
  // }
}

exports.getEmployeefilter = (req, res) => {
  try {
    var offset =
      req.query.offset != undefined ? parseInt(req.query.offset) : false
    var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
    var searchString = req.query.searchString
    var role_id = req.query.role_id
    var branch_id = req.query.branch_id
    var status = req.query.status
    var department_id = req.query.department_id
    var shift_time_id = req.query.shift_time_id
    var company_id = req.query.company_id
    var query = searchString
      ? {
          active_status: 1,
          company_id: company_id,
          $text: { $search: searchString }
        }
      : { active_status: 1, company_id: company_id }
    if (role_id) query['role_id'] = role_id
    if (branch_id) query['branch_id'] = branch_id
    if (department_id) query['department_id'] = department_id
    if (status) query['status'] = status
    if (shift_time_id) query['shift_time_id'] = shift_time_id

    User.find(query)
      .populate('department_id')
      .populate('role_id')
      .populate('branch_id')
      .populate('shift_time_id')
      .skip(offset)
      .limit(limit)
      .then(user => {
        res.status(200).send({ success: true, user: user })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (err) {
    res.status(400).send(err)
  }
}

exports.updateForgotpassword = async (req, res) => {
  try {
    var exist = await User.findOne({
      employee_id: req.params.employee_id,
      active_status: 1
    }).exec()
    console.log(exist)
    if (exist) {
      User.updateOne(
        { employee_id: req.params.employee_id, active_status: 1 },
        { new_pass_req: true }
      )
        .then(Update => {
          res
            .status(200)
            .send({ success: true, message: 'Employee Updated Successfully!' })
        })
        .catch(error => {
          res
            .status(200)
            .send({ success: false, error: error, message: 'An Error Occured' })
        })
    } else if (!exist) {
      res
        .status(409)
        .send({ success: false, message: 'Employee does not Exist!' })
    }
  } catch (err) {
    res
      .status(200)
      .send({ success: false, error: err, message: 'An Error Catched' })
  }
}

exports.delete = (req, res) => {
  try {
    User.findByIdAndUpdate(
      req.query.id,
      { active_status: 0, status: 0 },
      function (err, branch) {
        if (!err) {
          res.status(200).send({
            success: true,
            message: 'Employee Deactivated Successfully!'
          })
          createLog(req.headers['authorization'], 'Employee', 0)
        } else {
          res
            .status(200)
            .send({ success: false, message: 'error in deactivating employee' })
        }
      }
    )
  } catch (err) {
    res.status(400).send(err)
  }
}
function tiltelCase (str) {
  const arr = str.split(' ')
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
  }
  const str2 = arr.join(' ')
  return str2
}

// function cartdetails () {
//   try {
 


  
    
//    storeModel.findOne({cartinfo : 1
//    }).sort({$natural:-1}).limit(1)
//   .then (output => {
//   //console.log(output)
 
  
 
//    for (var i = 0; i < output.data.cart.length; i++ ){
//      var cartqty1 = output.data.cart[i].qty
//     // var item = output.data
//      var total_quantity1 = output.data.total_quantity
//      var cartstatus1 = output.data.cart[i].cart_status
//      var cartid1 = `cart.${i}.qty`
//      var cartstatus = `cart.${i}.cart_status`
     
   
//      //project(cartid,cartqty1)
//     // var cartcartqty1 = cart[i].qty
//     var query = {[`${cartid1}`] : cartqty1,[`${cartstatus}`] : cartstatus1,total_quantity: total_quantity1};
//    //var query = { "cart.0.qty" : cartqty1,"cart.0.cart_status" : cartstatus1}
//    //console.log(query)
//    cartModel.findOneAndUpdate(
//     {user: output.user,company_id: output.company_id},query
    
//     ).then(update => {
      
//      // console.log(query)
//          // console.log(update)
//              })

//     }
   
  

              
       
//         })
//       }catch (err) {
//         console.log(err)
//       }
// }

 
//  function kitdetails () {
//   try {
 
 
    
//    storeModel.findOne({kitinfo : 1
//    }).sort({$natural:-1}).limit(1)
//   .then (output => {
 
  
 
//    for (var i = 0; i < output.data.Kits.length; i++ ){
//      var kitqty1 = output.data.Kits[i].qty
//      //var total_quantity1 = output.data.total_quantity
//      var kitstatus1 = output.data.Kits[i].kit_status
//      var kitid1 = `kitting.${i}.qty`
//      var kitstatus = `kitting.${i}.kit_status`
     
   
//      //project(cartid,cartqty1)
//     // var cartcartqty1 = cart[i].qty
//     var query = {[`${kitid1}`] : kitqty1,[`${kitstatus}`] : kitstatus1};
//    //var query = { "cart.0.qty" : cartqty1,"cart.0.cart_status" : cartstatus1}
//    //console.log(query)
//    cartModel.findOneAndUpdate(
//      {user: output.user,company_id: output.company_id},query
     
//      ).then(update => {
       
//       // console.log(query)
//           // console.log(update)
//               })
 
//      }
    
   
 
               
        
//          })
//        }catch (err) {
//          console.log(err)
//        }
//  }
// kitdetails()
        

//  function cartdetailsadd () {
//   try {
 
 
    
//    storeModel.findOne({cartinfo : 2
//    }).sort({$natural:-1}).limit(1)
//   .then (output => {

//     for (var i = 0; i < output.data.cart.length; i++ ){
          
//            //var cartstatus1 = output.data.cart[i].cart_status
//           // var cartid1 = `cart.${i}.qty`
//            //var cartstatus = `cart.${i}.cart_status`
 
//     var cart = output.data.cart
//     var item = output.data.cart[i].item
//     var allocation = output.data.cart[i].allocation
//     var options = { upsert: true, new: true, setDefaultsOnInsert: true }
//     var cart_status = output.data.cart[i].cart_status
//     var qty = output.data.cart[i].qty
//    var cartAdding = AddCart({
//       cartData: cart,
//       item: item,
//       allocation: allocation,
//       cart_status : cart_status,
//       qty : qty
//     })
   
     
   
 
//    cartModel.updateOne(
//      {user: output.user},{ $set: { "cart": cartAdding } }
     
     
//      ).then(update => {
       
//      //  console.log(cartAdding)
//           //  console.log(update)
//               })
 
//      }})
    
   
 
               
        
         
//        }catch (err) {
//          console.log(err)
//        }
//  }
 //cartdetailsadd()


// //  function kitdetailsadd () {
// //   try {
 
 
    
//    storeModel.findOne({cartinfo : 2
//    }).sort({$natural:-1}).limit(1)
//   .then (output => {
 
//     //var cart = output.data.cart
   
   
     
   
 
//    cartModel.findOneAndUpdate(
//      {user: output.user},cartAdding,options
     
//      ).then(update => {
       
//        console.log(cartAdding)
//           //  console.log(update)
//               })
 
//      })
    
   
 
               
        
         
//        }catch (err) {
//          console.log(err)
//        }
//  }
//  cartdetailsadd()

// function cartdetails () {
//   try {
 
 
    
//    storeModel.findOne({cartinfo : 1
//    }).sort({$natural:-1}).limit(1)
//   .then (output => {
//  //   for(var key in output.jsonData) {
//  //     for (var key1 in output.jsonData[key]) {
//  //         console.log(output.jsonData[key][key1])
//  //     }
//  //  }
//    //console.log(output)
//   //var cart = output.data.cart
//     var itemId = output.data.cart.item
//     var allocation = output.data.cart.allocation
//     var options = { upsert: true, new: true, setDefaultsOnInsert: true }
//     var cart_status = output.data.cart.cart_status
//     var qty = output.data.cart.qty
//     cartAdding = AddCart({
//       cartData: output.data.cart,
//       item: itemId,
//       allocation: allocation,
//      cart_status : cart_status,
//       qty : qty
//     })
 
//    for (var i = 0; i < output.data.cart.length; i++ ){
//      var cartqty1 = output.data.cart[i].qty
//      var total_quantity1 = output.data.total_quantity
//      var cartstatus1 = output.data.cart[i].cart_status
//      var cartid1 = `cart.${i}.qty`
//      var cartstatus = `cart.${i}.cart_status`

 
   
//      //project(cartid,cartqty1)
//     // var cartcartqty1 = cart[i].qty
//     var query = {[`${cartid1}`] : cartqty1,[`${cartstatus}`] : cartstatus1,total_quantity: total_quantity1};
//    //var query = { "cart.0.qty" : cartqty1,"cart.0.cart_status" : cartstatus1}
//    console.log(query)
//    cartModel.findOneAndUpdate(
//      {user: output.user,company_id: output.company_id},query
     
//      ).then(update => {
       
//       // console.log(query)
//            console.log(update)
//               })
 
//      }
    
   
 
               
        
//          })
//        }catch (err) {
//          console.log(err)
//        }
//  }
 
//          cartdetails()
function kitdetailsadd () {
  try {
 
 
    
   storeModel.findOne({kitinfo : 2
   }).sort({$natural:-1}).limit(1)
  .then (output => {

   // console.log(output)
//if (is_old_kit = false) {
    for (var i = 0; i < output.data.Kits.length; i++ ){
          
           //var cartstatus1 = output.data.cart[i].cart_status
          // var cartid1 = `cart.${i}.qty`
           //var cartstatus = `cart.${i}.cart_status`
 
    var kitting = output.data.Kits
    var kit_id = output.data.Kits[i].kit_id
    var kit_status = output.data.Kits[i].kit_status
    //var qty = output.data.Kits[i].qty
    var options = { upsert: true, new: true, setDefaultsOnInsert: true }
    //var cart_status = output.data.Kits[i].cart_status
    var qty = output.data.Kits[i].qty
   var kitAdding = AddKit({
    kitData: kitting,
          kit_id : kit_id,
          kit_status : kit_status,
          item_quantity : qty,
          qty : 1
    })
   
     
   
 
   cartModel.updateOne(
     {user: output.user},{ $set: { "kitting": kitAdding } }
     
     
     ).then(create => {
       
     // console.log(kitting)
           // console.log(create)
              })
 
     }})
    
   
 
               
        
         
       }catch (err) {
         console.log(err)
       }
 }
// kitdetailsadd()
function kitdetailsadd1 () {
  try {
 
 
    
   storeModel.findOne({kitinfo : 2
   }).sort({$natural:-1}).limit(1)
  .then (output => {
    // var quantity = output.data.Kits[i].kit_item_details[i].quantity
    // console.log(quantity)
    //var category = output.data.Kits[i].kit_item_details[i].category
    //console.log(category)
//if (is_old_kit = false) {
    for (var i = 0,j = 0; i < output.data.Kits.length; i++ ){
          
           var quantity = output.data.Kits[i].kit_item_details[i].quantity
           
           //var quantity1 = quantity
           var query = {quantity : quantity};
   stockAllocationModel.findOneAndUpdate(
     {company_id :output.company_id},query
     
     
     ).then(create => {
       
      // console.log(kitAdding)
           console.log(quantity)
              })
 
     }})
    
   
 
               
        
         
       }catch (err) {
         console.log(err)
       }
 }
 kitdetailsadd1()