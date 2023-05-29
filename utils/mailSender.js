const nodemailer = require("nodemailer")
require("dotenv").config()

exports.mailSender = async(email,title,body) => {
    try{
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER ,
                pass: process.env.MAIL_PASS
            }
        })
        const info = transporter.sendMail({
            from: "StudyNotion by Piyush Bhawsar" ,
            to: {email},
            subject: {title},
            html: {body}

        })
    } catch(e) {
        console.log(e)
    }
}

 