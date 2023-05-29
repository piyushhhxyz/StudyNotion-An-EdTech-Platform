const { default: mongoose } = require("mongoose")
require("dotenv").config()

exports.dbConnect = async() => {
    await mongoose.connect(process.env.MONOGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(console.log("DB Connected Successfully"))
        .catch(e=>{
            console.log("DB Conection Failed ERRROR")
            console.error(e.message)
            process.exit(1)
        })
}