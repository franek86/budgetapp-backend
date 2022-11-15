const mongoose = require("mongoose");

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to mongoDB.");
    } catch (error) {
        console.error(error)
    }
}

module.exports = connectDB; 