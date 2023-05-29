const { default: mongoose, Mongoose } = require("mongoose");

const courseSchema = mongoose.Schema({
    courseName: {
        type: String
    },
    courseDescription: {
        type: String
    },
    intructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    whatYouWillLearn: {
        type: String,
    },  
    courseContent: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Section"
    }],
    ratingAndReviews: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "RatingReview"
    }],
    price: {
        type: Number
    },
    thumbnail: {
        type: String
    },
    tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    },
    studentEnrolled: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

})

module.exports = mongoose.model("Course",courseSchema)