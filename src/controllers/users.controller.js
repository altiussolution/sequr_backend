var User = require('../models/user.model');
let Utils = require('../utils/enum.utils');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var generator = require('generate-password');


exports.add = (async (req, res) => {
    try {
        // var password = generator.generate({
        //     length: 6,
        //     numbers: true
        // });
        var password  = '1q2w3e$R';
        const { first_name, last_name, email_id,contact_no,date_of_birth,role_id,language_prefered,employee_id,item_max_quantity, branch_id, shift_time_id, department_id, profile_pic} = req.body;

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
          email_id: email_id.toLowerCase(), // sanitize: convert email to lowercase
          password: encryptedPassword,
          status : 1
        });
        const token = jwt.sign(
          { user_id: user._id, employee_id },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        user.token = token;
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

    if (user && (await bcrypt.compare(password, user.password))) {
      
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
