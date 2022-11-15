const User = require("../models/User");

const getAllUser = async(req,res,next) => {
    const {search} = req.query;
    let query = {}

    if(search){
        query.$or = [
            { username: { $regex: search, $options: "(?i)a(?-i)" }},
            { email: { $regex: search, $options: "(?i)a(?-i)" }}
          ]
    }
    

    try {
        const users = await User.find(query).sort({"createdAt": 1})

        res.status(200).json({data:users})
    } catch (error) {
        next(error)
    }
   
}

const updateUser = async(req, res, next) => {
    const {id} = req.params
    try {

        const userExist = await User.findById(id); 

        if(!userExist){
            res.status(400) 
            throw new Error("User not found")
        }
        
        const updateUser = await User.findByIdAndUpdate(id, req.body, {new:true})

        res.status(200).json({date:updateUser, message:`User ${id} successfully updated.`})
    } catch (error) {
        next(error)
    }
    
}

const deleteUser = async(req, res, next) => {
    const {id} = req.params;
    const {username}=req.body;
    try {
       const userExist = await User.findById(id);
       if(!userExist){
            res.status(400) 
            throw new Error("User not found")
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({message:`User ${username} successfully deleted`})

    } catch (error) {
        next(error)
    }
}



module.exports = {
    getAllUser,
    updateUser,
    deleteUser
}