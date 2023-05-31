const Tag = require("../models/Tag")

exports.createTag = async(req,res) => {
    try{
        const {name,decription} = req.body 
        if(!name || !decription) {
            return res.status(401).json({
                success: false,
                message: "All Fields Are Required"
            })
        }
        const response = await Tag.create({name,decription}) 
        return res.status(200).json({
            success: false,
            message: "Tag Created Successfully"
        })
    }
    catch(e) {const Tag = require("../models/tags");

    //create Tag ka handler funciton
    
    exports.createTag = async (req, res) => {
        try{
            //fetch data
                const {name, description} = req.body;
            //validation
                if(!name || !description) {
                    return res.status(400).json({
                        success:false,
                        message:'All fields are required',
                    })
                }
            //create entry in DB
                const tagDetails = await Tag.create({
                    name:name,
                    description:description,
                });
                console.log(tagDetails);
                //return response
    
                return res.status(200).json({
                    success:true,
                    message:"Tag Created Successfully",
                })
    
    
        }
        catch(error) {
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
    };
    
    //getAlltags handler function
    
    exports.showAlltags = async (req, res) => {
        try{
            const allTags = await Tag.find({}, {name:true, description:true}); 
            res.status(200).json({
                success:true,
                message:"All tags returned successfully",
                allTags,
            })
        }
        catch(error) {
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
    };
        console.error(e)
        res.status(500).json({
            success: false ,
            data: 'ERROR In Creating Tag' ,
            message: e.message
        })
    }
}

exports.getAllTags = async(req,res) => {
    try{
        const allTags = await Tag.find({},{email:true,decription:true})
        res.status(200).json({
            success: false ,
            data: {allTags} ,
            message: "Fetched All Tags"
        })
    }
    catch(e) {
        console.error(e)
        res.status(500).json({
            success: false ,
            data: 'ERROR In Fetching All Tags' ,
            message: e.message
        })
    }
}
