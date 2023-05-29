const { default: mongoose, Mongoose } = require("mongoose");

const subSectionSchema = mongoose.Schema({
    title: {
        type: String
    },
    timeDuration: {
        type: String
    },
    description: {
        type: String 
    },
    videoUrl: {
        type: String
    }, 
})

module.exports = mongoose.model("SubSection",subSectionSchema) 