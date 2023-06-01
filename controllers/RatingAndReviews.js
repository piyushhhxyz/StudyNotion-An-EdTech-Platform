const Course = require("../models/Course")
const RatingAndReview = require("../models/RatingAndReview")

exports.createRating = async(req,res) => {
    try{
        const userId = req.user.id //yaha tak aaya hai to authenticated hi hoga...and auth mai hamne .user daala tha req mai
        const { rating,review,courseId } = req.body 
        //check if already enrolled or not -> User_x registered in Course_y
        const courseDetail = await Course.findOne({
                                    _id: courseId,
                                    studentsEnrolled: {$elemMatch: {$eq: userId}}
                            }) 
        if(!courseDetail){
            return req.status(404).json({
                success: false, 
                message: "This mf.User Not Purchased This Course yet"
            })
        }
        //check if user_x not already reviewed this course (1 review per user on particular course )
        const alreadyReviewed = await RatingAndReview.findOne({
                                        user: userId,
                                        course: courseId
                                })
        if(alreadyReviewed){
            return req.status(403).json({
                success: false, 
                message: "This mf.User has Already Reviewed This Course"
        })
        }
        const ratingReview = await RatingAndReview.create({
                                    user:userId,
                                    rating,review,
                                    course:courseId
                                })
        //update this new entry in r&r model to course Model
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                            {_id:courseId},
                            {
                                $push: {
                                    ratingAndReviews: ratingReview._id
                                }
                            },
                            {new: true })
        console.log(updatedCourseDetails)
        return req.status(200).json({
                success: true, 
                message: "Review And Rating Added On This Course" ,
                ratingReview 
        })                       

    }
    catch(e) {
        return req.status(500).json({
            success: false, 
            message: e.message ,
        })  
    }
}


exports.getAverageRating = async(req,res) => {
    try{
        const courseId = req.body.courseId 
        const result = await RatingAndReview.aggregate([
            {$match: {course: new mongoose.Types.ObjectId(courseId)}},
            {$group: {
                _id: null,
                averageRating: {$avg: "$rating"}
            }}
        ])
        if (result.length>0) {
            return req.status(200).json({
                success: true, 
                averageRating: result[0].averageRating ,
            })
        }
        return req.status(200).json({
            success: true, 
            message: "Average Rating is Zero , as no Ratings given yet" ,
            averageRating: 0 
        })

    } catch(e) {
        return req.status(500).json({
            success: false , 
            message: e.message ,
        })  
    }
}

exports.getAllRatings = async(req,res) => {
    try{
        
    } catch(e) {
        return req.status(500).json({
            success: false, 
            message: e.message ,
        })  
    }
}