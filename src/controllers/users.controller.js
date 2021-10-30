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
      country_id,
      state_id,
      city_id,
      profile_pic,
      active_status
    } = req.body

    if (
      !(email_id && employee_id && first_name && role_id && language_prefered)
    ) {
      res.status(400).send('All input is required')
    }
    const oldUser = await User.findOne({ employee_id })

    if (oldUser) {
      return res
        .status(409)
        .send({ status: false, message: 'User Already Exist. Please Login' })
    }
    console.log(password)
    encryptedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
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
      country_id,
      state_id,
      city_id,
      profile_pic,
      email_id: email_id, // sanitize: convert email to lowercase
      password: encryptedPassword,
      active_status: active_status ? active_status : 0
    })
    const token = jwt.sign(
      { user_id: user._id, employee_id },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h'
      }
    )
    const hostname = process.env['USER'] == 'ubuntu' ? '172.31.45.190' : 'localhost';
    const locals = {
      employee_id: employee_id,
      password: password,
      loginPage: process.env.STAGING,
      logo : `${appRouteModels.BASEURL}/mailAssets/logobg.png`,
      background : `${appRouteModels.BASEURL}/mailAssets/bgbg.jpg`
    }
    user.token = token
    const email = new Email()
    Promise.all([email.render('../src/templates/registerMail', locals)]).then(
      async registerMail => {
        await sendEmail(
          email_id,
          'New User Signup',
          registerMail[0],          
        )
      }
    )
    res.status(201).json(user)
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

    if (
      user &&
      (await bcrypt.compare(password, user.password)) &&
      user.active_status
    ) {
      const token = jwt.sign(
        { user_id: user._id, employee_id },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h'
        }
      )

      user.token = token

      res.status(200).json(user)
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

exports.upload = async (req, res) => {
  try {
    if (req.file) {
      var filename = `${req.user.user_id}.${req.file.originalname
        .split('.')
        .pop()}`
      res.status(200).send({
        message: 'Profile Added Sucessfully',
        Path: `${req.file.destination.replace(
          './src/public/',
          appRouteModels.BASEURL
        )}/${filename}`
      })
    }
  } catch (err) {
    res.status(400).send(err.name)
  }
}

exports.update = async (req, res) => {
  try {
    var userId = req.query.id
    var updateUser = req.body
    User.findByIdAndUpdate(userId, updateUser, (err, isExist) => {
      if (isExist) {
        res.status(200).send({ message: 'Employee Updated Sucessfully' })
      } else {
        res.status(201).send({ message: 'Employee Not Found' })
      }
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

exports.delete = (req, res) => {
  User.findByIdAndUpdate(
    req.query.id,
    { active_status: 0, status: 0 },
    function (err, branch) {
      if (!err) {
        res.status(200).send({
          success: true,
          message: 'Employee Deactivated Successfully!'
        })
      } else {
        res
          .status(200)
          .send({ success: false, message: 'error in deactivating employee' })
      }
    }
  )
}

exports.listEmployees = (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
  var searchString = req.query.searchString
  var query = searchString
    ? { active_status: 1, $text: { $search: searchString } }
    : { active_status: 1 }
  User.find(query)
    .populate('department_id')
    .skip(offset)
    .limit(limit)
    .then(result => {
      res.send(result)
    })
}

exports.forgotPassword = async (req, res) => {
  try {
    const schema = Joi.object({
      email_id: Joi.string()
        .email()
        .required()
    })
    const { error } = schema.validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await Models.userModel.findOne({ email_id: req.body.email_id })
    if (!user)
      return res.status(400).send("user with given email doesn't exist")

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
      adminName:`${user.first_name} ${user.last_name}`,
      logo : `${appRouteModels.BASEURL}/mailAssets/logobg.png`,
      background : `${appRouteModels.BASEURL}/mailAssets/bgbg.jpg`
    }
    const email = new Email()
    Promise.all([email.render('../src/templates/adminForgotPassword', locals)]).then(
      async adminForgotPassword => {
        await sendEmail(
          user.email_id,
          'Password reset',
          adminForgotPassword[0],          
        )
      }
    )

    

    res.send('password reset link sent to your email account')
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
    if (!user) return res.status(400).send('invalid link or expired')

    const token = await Models.resetPasswordTokenModel.findOne({
      user_id: user._id,
      token: req.params.token
    })
    if (!token) return res.status(400).send('Invalid link or expired')

    user.password = await bcrypt.hash(req.body.password, 10)
    await user.save()
    await token.delete()

    res.send('password reset sucessfully.')
  } catch (error) {
    res.send('An error occured')
    console.log(error)
  }
}

exports.userProfile = async (req, res) => {
  var userId = req.params.id
  try {
    var userDetails = await User.findOne({
      _id: userId,
      active_status: 1,
      status: 1
    }).exec()
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
      userName:`${user.first_name} ${user.last_name}`,
      logo : `${appRouteModels.BASEURL}/mailAssets/logobg.png`,
      background : `${appRouteModels.BASEURL}/mailAssets/bgbg.jpg`
    }
    const email = new Email()
    Promise.all([email.render('../src/templates/employeeNewPassword', locals)]).then(
      async employeeNewPassword => {
        await sendEmail(
          user.email_id,
          'New Password',
          employeeNewPassword[0],          
        )
      }
    )



    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    await User.findByIdAndUpdate(req.body.id, {
      password: encryptedPassword
    }).exec()
    res.send('new password sent to employee email account')
  } catch (error) {
    res.send('An error occured')
    console.log(error)
  }
}

exports.changePassword = async (req, res) => {
  var passwordDetails = req.body
  console.log(req.body)
  var userId = req.params._id
  console.log(userId)
  if (userId) {
    if (passwordDetails.newpassword) {
      await User.findOne({ userId: userId }, async function (err, user) {
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
}

exports.getEmployeefilter = (req, res) => {
  var role_name = req.query.role_name;
  var branch_name= req.query.branch_name;
  var status = req.query.status;
  var department_name = req.query.department_name;
  var shift_type = req.query.shift_type;
 
  if (role_name && branch_name && status && department_name && shift_type){
      var query = {role_name:role_name,branch_name :branch_name , status  : status ,department_name:department_name, shift_type:shift_type}
  }
  else if(role_name && branch_name && department_name && shift_type){
      var query = {role_name: role_name, branch_name : branch_name ,department_name:department_name,shift_type:shift_type }
  }
  else if( role_name && status  && branch_name && shift_type){
      var query = { role_name: role_name ,  status : status ,branch_name : branch_name,shift_type:shift_type}
  }
  else if( branch_name  && status  && department_name && shift_type){
      var query = {branch_name  : branch_name  , status : status ,department_name :department_name,shift_type:shift_type}
  }
  else if( role_name  && status && department_name && shift_type ){
      var query = {role_name  : role_name  , status :status ,department_name :department_name,shift_type:shift_type}
  }
    else if( role_name  && status && department_name && branch_name ){
      var query = {role_name  : role_name  , status :status ,department_name :department_name,branch_name:branch_name}
  }
  else if( role_name && branch_name && shift_type){
      var query = {role_name:role_name , branch_name : branch_name,shift_type:shift_type}
  }                                                                                                     
  else if(role_name && department_name && shift_type){
      var query = { role_name :role_name ,department_name:department_name,shift_type : shift_type}
  }
  else if( role_name && status && shift_type){
      var query = { role_name :role_name , status:status,shift_type:shift_type}
  }
  
  else if( branch_name && department_name && shift_type){
      var query = {branch_name : branch_name, department_name:department_name,shift_type:shift_type}
  }
  else if( branch_name && status && shift_type ){
      var query = {branch_name : branch_name, status:status,shift_type:shift_type}
  }
  else if( status && department_name && shift_type){
      var query = { status :status,department_name:department_name,shift_type:shift_type  }
  }
else if(role_name && department_name && branch_name){
      var query = { role_name :role_name ,department_name:department_name,branch_name:branch_name}
  }
else if(role_name && status && branch_name){
      var query = { role_name :role_name , status: status,branch_name:branch_name}
  }
else if(department_name && status && branch_name){
      var query = { department_name :department_name , status: status,branch_name:branch_name}
  }

else if( role_name && branch_name){
      var query = {role_name:role_name , branch_name : branch_name}
  }                                                                                                     
  else if(role_name && department_name){
      var query = { role_name :role_name ,department_name:department_name}
  }
  else if( role_name && status){
      var query = { role_name :role_name , status:status}
  }
  else if( branch_name && department_name){
      var query = {branch_name : branch_name, department_name:department_name}
  }
  else if( branch_name && status ){
      var query = {branch_name : branch_name, status:status}
  }
  else if( status && department_name){
      var query = { status :status,department_name:department_name  }
  }
 else if( role_name && shift_type){
      var query = { role_name :role_name ,shift_type:shift_type  }
  }
 else if(  shift_type && department_name){
      var query = { shift_type :shift_type,department_name:department_name  }
  }
 else if( branch_name && shift_type){
      var query = {branch_name :branch_name ,shift_type:shift_type  }
  }
 else if( status && shift_type){
      var query = { status :status,shift_type:shift_type  }
  }
else if( department_name ){
    var query = { department_name :department_name}
}
else if( role_name ){
    var query = { role_name :role_name}
}
else if( branch_name ){
    var query = { first_name :first_name}
}
else if( status  ){
    var query = {  status: status}
}
else if( shift_type  ){
  var query = {  shift_type: shift_type}
}

User.find(query).populate('department_id').populate('role_id').populate('branch_id').populate('shift_time_id').then(user =>{
  res.status(200).send({ success: true, user: user });
}).catch(error => {
  res.status(400).send({success: false, error : error})
})

}