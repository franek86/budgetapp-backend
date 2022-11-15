const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


const registerUser = async(req, res, next) => {
    const {username, email, password} = req.body;
    try {

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({username, email, password:hashPassword})
        await newUser.save();
        res.status(201).json({newUser, message:"New user has been created."})
    } catch (error) {
        next(error)
    }
}

const loginUser = async(req,res, next) => {
    const {username} = req.body;
    try {
        const user = await User.findOne({username});
        if(!user) return next(404);

        const checkPassword = await bcrypt.compare(req.body.password, user.password);
        if(!checkPassword) return next(404);

        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin},process.env.SECRET_JWT,{expiresIn: "2 days"});


        const {isAdmin, password, ...rest} = user._doc;
        res.cookie("access_token", token,{httpOnly: true}).status(200).json({...rest, message: `Username ${username} successfully login.`});
        
    } catch (error) {
        next(error)
    }
}

const logoutUser = async(req, res) => {
    res.cookie("access_token", "",{maxAge: 1})
    
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}