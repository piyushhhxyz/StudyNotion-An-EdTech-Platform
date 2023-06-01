const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const {instance} = require("../config/razorpay");

exports.capturePayment = async(req,res) => {
    const {course_id} = req.body 
    const userId = req.user.id //string mai hai abhi 

    if(!course_id) {
        res.json({
            success: false,
            message: "Please Provide Course ID" 
        })
    }
    let course ;
    try{
        course = await Course.findOne(course_id) 
        if(!course) {
            res.json({
                success: false,
                message: "No Course With this Course_id" 
            })
        }
        const uid = await mongoose.Schema.Types.ObjectId(userId) //strring to ObjectId(type)
        if(course.studentsEnrolled.includes(uid)) {
            res.json({
                success: false,
                message: "the user with this userid has already baught this course" 
            })
        }
    }catch(e) {
        res.status(500).json({
            success: false,
            message: e.message 
        })
    }
    //order creation
    const amount = course.price 
    const currency = "INR"

    const options = {
        amount: amount*100 ,
        currency ,
        reciept: Math.random(Date.now()).toString() ,
        notes: {
            courseId: course_id,
            userId
        }
    }
    try{
        const paymentResponse = await instance.orders.create(options)
        console.log(paymentResponse)
        res.status(200).json({
            success: true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount, 
        })
    }catch(e) {
        console.log(error);
        res.json({
            success:false,
            message:"Could not initiate order",
        });
    }
}

//verify Signature of Razorpay and Server
exports.verifySignature = async (req, res) => {
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];

    const shasum =  crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest) {
        console.log("Payment is Authorised");

        const {courseId, userId} = req.body.payload.payment.entity.notes;

        try{
                //fulfil the action
                //find the course and enroll the student in it
                const enrolledCourse = await Course.findOneAndUpdate(
                                                {_id: courseId},
                                                {$push:{studentsEnrolled: userId}},
                                                {new:true},
                );

                if(!enrolledCourse) {
                    return res.status(500).json({
                        success:false,
                        message:'Course not Found',
                    });
                }
                console.log(enrolledCourse);
                //find the student andadd the course to their list enrolled courses me 
                const enrolledStudent = await User.findOneAndUpdate(
                                                {_id:userId},
                                                {$push:{courses:courseId}},
                                                {new:true},
                );
                console.log(enrolledStudent);
                //mail send krdo confirmation wala 
                const emailResponse = await mailSender(
                                        enrolledStudent.email,
                                        "Congratulations from CodeHelp",
                                        "Congratulations, you are onboarded into new CodeHelp Course",
                );
                console.log(emailResponse);
                return res.status(200).json({
                    success:true,
                    message:"Signature Verified and COurse Added",
                });
        }       
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }
    else {
        return res.status(400).json({
            success:false,
            message:'Invalid request',
        });
    }
};
