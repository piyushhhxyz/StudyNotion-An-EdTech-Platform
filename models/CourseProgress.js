const { default: mongoose, Mongoose } = require("mongoose");

const courseProgessSchema = mongoose.Schema({
    CourseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    completedVideos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection"
    }]
})

module.exports = mongoose.model("CourseProgress",courseProgessSchema)