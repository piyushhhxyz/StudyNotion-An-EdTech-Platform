const { default: mongoose, Mongoose } = require("mongoose");

const profileSchema = mongoose.Schema({
    gender: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    about: {
        type: String,
        trim: true
    },
    contactNumber: {
        type: Number,
        trim: true
    },  
})

module.exports = mongoose.model("Profile",profileSchema)