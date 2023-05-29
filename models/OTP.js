const { default: mongoose, Mongoose } = require("mongoose");
const { mailSender } = require("../utils/mailSender");

const OTPSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5*60 
    } 
})

const sendVerificationEmail = async(email,otp) => {
    try{
        const mailResponse = await mailSender(email,"Verification Mail From StudyNotion",otp)
        console.log("Mail Sent Successfully:" ,mailResponse) 

    } catch(e) {
        console.log("Error While Sending Mail", e)
    }
} 

OTPSchema.pre("save", async(next) => {
    await sendVerificationEmail(this.email, this.otp)
    next()
})

module.exports = mongoose.model("OTP",OTPSchema) 