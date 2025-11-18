const mongoose = require('mongoose');
require('dotenv').config();
const mongodbURL = process.env.MONGODB_URI;

const connectDB = async() => {
    try {
        await mongoose.connect(mongodbURL);
        console.log("MongoDB connected successfully!!!");
    } 
    catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);
    }
};

module.exports = connectDB;