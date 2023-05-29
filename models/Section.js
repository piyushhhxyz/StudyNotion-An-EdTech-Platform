const { default: mongoose, Mongoose } = require("mongoose");

const sectionSchema = mongoose.Schema({
    sectionName: {
        type: String
    },
    subSection: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "SubSection"
    }]
})

module.exports = mongoose.model("Section",sectionSchema) 