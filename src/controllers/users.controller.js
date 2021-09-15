var {User} = require('../models/user.model');
var Models = require('../models/index')
const {appRouteModels} = require('../utils/enum.utils');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const sendEmail = require("../middleware/sendmail.middleware");
const crypto = require("crypto");
const Joi = require("joi");
var generator = require('generate-password');


exports.add = (async (req, res) => {
    try {
        var password = generator.generate({
            length: 6,
            numbers: true
        });
        
        // var password  = '1q2w3e$R';
        const { first_name, last_name, email_id,contact_no,date_of_birth,role_id,language_prefered,employee_id,item_max_quantity, branch_id, shift_time_id, department_id, profile_pic, active_status} = req.body;

        if (!(email_id && employee_id && first_name && role_id && language_prefered )) {
          res.status(400).send("All input is required");
        }
        const oldUser = await User.findOne({ employee_id });
    
        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }
    
        encryptedPassword = await bcrypt.hash(password, 10);
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
          profile_pic,
          email_id: email_id, // sanitize: convert email to lowercase
          password: encryptedPassword,
          active_status : active_status ? active_status : 0
        });
        const token = jwt.sign(
          { user_id: user._id, employee_id },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        user.token = token;
        var subject = `Dear ${first_name}, Use the following to siginin in sequr username - ${employee_id} , password - ${password}`
        await sendEmail(email_id, "New User Signup",subject );
        res.status(201).json(user);
      } catch (err) {
        console.log(err);
      }
})



exports.login = (async (req,res) =>{
  try {
    const { employee_id, password } = req.body;
    if (!(employee_id && password)) {
      res.status(400).send("All input is required");
    }
    
    const user = await User.findOne({ employee_id });

    if (user && (await bcrypt.compare(password, user.password)) && user.active_status) {
      
      const token = jwt.sign(
        { user_id: user._id, employee_id },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      
      user.token = token;
    
      res.status(200).json(user);

    }else{
      res.status(400).send("Invalid Credentials or No user found");
    }
    
  } catch (err) {
    console.log(err);
  }
})

exports.upload = (async(req,res) => {
  try{
    if(req.file){
      var filename = `${req.user.user_id}.${req.file.originalname.split('.').pop()}`
      res.status(200).send({message : 'Profile Added Sucessfully', Path : `${req.file.destination.replace('./src/public/',appRouteModels.BASEURL)}/${filename}`})
    }
  }catch (err) {
    res.status(400).send(err.name);
  }
 
})

exports.update = (async (req,res) =>{
  try{
    var userId = req.query.id;
    var updateUser = req.body
    User.findByIdAndUpdate(userId,updateUser,(err,isExist) =>{
      if(isExist){
        res.status(200).send({message : 'Employee Updated Sucessfully'})
      }else{
        res.status(201).send({message : 'Employee Not Found'})
      }
    })
  }
  catch(err){
    res.status(400).send(err);
  }
})

exports.delete = ((req, res) => {
  User.findByIdAndUpdate(req.query.id, {active_status: 0, status: 0} , function(err, branch){
      if (!err) {
          res.status(200).send({ success: true, message: 'Employee Deactivated Successfully!' });
      }
      else {
          res.status(200).send({ success: false, message: 'error in deactivating employee' });
      }
  });
})

exports.listEmployees = ((req,res) => {
  var offset = parseInt(req.query.offset);
  var limit = parseInt(req.query.limit);
  User.find({active_status : 1, status : 1}).populate("department_id").skip(offset).limit(limit).then(result =>{
    res.send(result)
  })
})

exports.forgotPassword = (async (req, res) => {
    try {
        const schema = Joi.object({ email_id: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await Models.userModel.findOne({ email_id: req.body.email_id });
        if (!user)
            return res.status(400).send("user with given email doesn't exist");

        let token = await Models.resetPasswordTokenModel.findOne({ user_id: user._id });
        if (!token) {
            token = await new Models.resetPasswordTokenModel({
                user_id: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
        await sendEmail(user.email_id, "Password reset", link);

        res.send("password reset link sent to your email account");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})

exports.resetPassword = (async (req, res) => {
    try {
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await Models.userModel.findById(req.params.user_id);
        if (!user) return res.status(400).send("invalid link or expired");

        const token = await Models.resetPasswordTokenModel.findOne({
            user_id: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");

        user.password = await bcrypt.hash(req.body.password, 10);
        await user.save();
        await token.delete();

        res.send("password reset sucessfully.");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})