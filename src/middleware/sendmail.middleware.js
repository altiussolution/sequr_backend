const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            // service: process.env.SERVICE,
            port: 587,
            secure: false,
            ignoreTLS:false,
            auth: {
                user: 'sequrrx@gmail.com',
                pass: 'sequr@123'
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            // text: text,
            html : html,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;