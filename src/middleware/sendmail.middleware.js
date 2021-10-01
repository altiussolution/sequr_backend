const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            // service: process.env.SERVICE,
            port: 587,
            secure: false,
            ignoreTLS:false,
            auth: {
                user: 'arun.chandrasekar@adcltech.com',
                pass: 'Welcome@123'
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;