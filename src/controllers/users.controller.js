let Utils = require('../utils/enum.utils')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var generator = require('generate-password');


exports.add = (async (req, res) => {
    try {
        var password = generator.generate({
            length: 10,
            numbers: true
        });
        const { first_name, last_name, email_id,contact_no,date_of_birth,role_id,language_prefered,employee_id,item_max_quantity, branch_id, shift_time, department_id, profile_pic} = req.body;
    
        if (!(email_id && employee_id && first_name && last_name)) {
          res.status(400).send("All input is required");
        }
        const oldUser = await User.findOne({ employee_id });
    
        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }
    
        encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          first_name,
          last_name,
          email_id: email_id.toLowerCase(), // sanitize: convert email to lowercase
          password: encryptedPassword,
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
