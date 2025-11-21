const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const crypto = require('crypto');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

require('dotenv').config();
const User = require('./Models/userModel')

const app = express();
const port = process.env.PORT || 1818;
app.use(express.json());


app.use(helmet());

// app.use(mongoSanitize());

app.use(cors({
    origin: "http://ourfrontendhost.com"
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    statusCode: 429,
    message: "Limit reached...You can't send more requests."
})

app.use(limiter);

const JWT = process.env.JWT_SECRET;
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

mongoose.connect("mongodb://localhost:27017/T-0003_Day-4_DB(pass_reset_refresh_token)")
.then(() => console.log("Database connected successfully"))
.catch(err => console.log(err));


app.post("/register", async (req, res) => {
    try {
        const{name, email, password} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        
        await newUser.save();

        res.json({message: "User registered successfully!!!", newUser});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.post("/login", async (req,res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
           return res.status(400).json({message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "Incorrect password!!!"});
        }
        
        const accessToken = jwt.sign(
            {id: user._id},
            ACCESS_SECRET,
            {expiresIn: "15m"}
        );

        const refreshToken = jwt.sign(
            {id: user._id},
            REFRESH_SECRET,
            {expiresIn: "15m"}
        );

        user.refreshToken = refreshToken;
        await user.save();

         res.json({ message: "Login successful", accessToken, refreshToken });

    }catch(error){
        res.status(500).json({error: error.message});
    }
});

app.post("/refresh-token", async (req, res) => {
    
    const {refreshToken} = req.body;
        
    if (!refreshToken){
        return res.status(401).json({ message: "Refresh Token required" });
    }

    const user = await User.findOne({ refreshToken });

    if (!user){
        return res.status(403).json({ message: "Invalid Refresh Token" });
    }

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

        const newAccessToken = jwt.sign(
        { id: decoded.id },
        ACCESS_SECRET,
        { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
        
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
});

app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user){
        return res.status(400).json({ message: "Email not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 5 * 60 * 1000; 
    await user.save();

    res.json({
        message: "Reset token generated",
        resetToken   
    });
});

app.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }   
    });

    if (!user){
        return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    res.json({ message: "Password updated successfully" });
});

app.listen(port, () => {
    console.log(`App running on "http://localhost:${port}`);
})