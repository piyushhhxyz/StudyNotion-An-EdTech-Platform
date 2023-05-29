const otpGenerator = require("otp-generator");
const User = require("../models/User");
const OTP = require("../models/OTP");

//Authorization
exports.sendOTP = async(req,res) => {
    try{
        const {email} = req.body ;
        const checkUserPresent = await User.findOne({email}) 

        if(checkUserPresent) {
            res.status(400).json({
                success: false ,
                message:"User Already Registered" 
            })
        }
        let otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false ,
            lowerCaseAlphabets:false ,
            specialChars: false ,
        })
        console.log("OTP Generated : ",otp)

        const otpPayload = {email,otp}
        const otpBody = await OTP.create(otpPayload) //otp create hone se pehele "pre-save" hit hoga and mailSender activates

        res.status(200).json({
            success: true,
            message: "OTP Sent Successfully"
        })
    }
    catch(e) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:e.message,
        })
    }
}

exports.signUp = async(req,res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body
        if ( firstName||lastName||email||password||confirmPassword||accountType||contactNumber||otp) {
            return res.status(401).json({
                success: false,
                message: "All Fields Are Required To Be Filled"
            })
        }
        if(password !== confirmPassword) {
            return res.json(400).json({
                success: false ,
                message: "Password and ConfirmPassword Value DONT MATCH"
            })
        }
        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Registered" 
            })
        }

        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1)
        console.log(recentOtp)
        if(!recentOtp) {
            return res.status(400).json({
                success:false,
                message:'OTP Not Found',
            })
        }
        else if(otp !== recentOtp) {
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth: null,
            about:null,
            contactNumer:null,
        })
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastName}`,
        })
        return res.status(200).json({
            success:true,
            message:'User is registered Successfully',
            user,
        });
    }
    catch(e) {
        console.log("ERROR While Signing Up")
    }
}

exports.login = async(req,res) => {
    try {
        //get data from req body
        const {email, password} = req.body;
        // validation data
        if(!email || !password) {
            return res.status(403). json({
                success:false,
                message:'All fields are required, please try again',
            });
        }
        //user check exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user) {
            return res.status(401).json({
                success:false,
                message:"User is not registrered, please signup first",
            });
        }
        //generate JWT, after password matching
        if(await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h",
            });
            user.token = token;
            user.password= undefined;

            //create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:'Logged in successfully',
            })

        }
        else {
            return res.status(401).json({
                success:false,
                message:'Password is incorrect',
            });
        }
        
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure, please try again',
        });
    }
};

//changePassword
//TODO: HOMEWORK
exports.changePassword = async (req, res) => {
    //get data from req body
    //get oldPassword, newPassword, confirmNewPassowrd
    //validation

    //update pwd in DB
    //send mail - Password updated
    //return response
}
