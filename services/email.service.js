const nodemailer = require('nodemailer');
const message = require('../config/message');

module.exports.sendEmail = function (emailid, subject, text, html) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: message.message.senderEmail,
            pass: message.message.senderPwd
        }
    });

    let mailOptions = {
        from: message.senderEmail,
        to: emailid,
        subject: subject,
        text: text,
        html: html

    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            return info.response;
        }
    });
}