const { default: mongoose, Mongoose } = require("mongoose");

const ratingAndReviewsSchema = mongoose.Schema({
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }],
    Rating: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("RatingAndReview",ratingAndReviewsSchema)  