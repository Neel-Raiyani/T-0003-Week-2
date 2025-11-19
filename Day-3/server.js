const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

require('dotenv').config();

const User = require('./Models/userModel');
const auth = require('./Middlewares/auth');
const adminOnly = require('./Middlewares/role');

const app = express();
const port = process.env.PORT || 1818;
app.use(express.json());

const JWT = process.env.JWT_SECRET;

mongoose.connect("mongodb://localhost:27017/T-0003_Day-3_DB(rolebased)")
.then(() => console.log("Database connected successfully"))
.catch(err => console.log(err));


app.post("/register", async (req, res) => {
    try {
        const{username, password, role} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            role
        });
        
        await newUser.save();

        res.json({message: "User registered successfully!!!", newUser});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.post("/login", async (req,res) => {
    try{
        const {username, password} = req.body;

        const user = await User.findOne({username});

        if(!user){
           return res.status(400).json({message: "Student not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "Incorrect password!!!"});
        }

        const token = jwt.sign(
            {id: user._id, username: user.username, role: user.role},
            JWT,
            {expiresIn: "1h"}
        );

         res.json({ message: "Login successful", token });

    }catch(error){
        res.status(500).json({error: error.message});
    }
});

app.get("/all-users", auth, adminOnly, async (req, res) => {
    const allUsers = await User.find();
    res.json(allUsers);
});

app.listen(port, () => {
    console.log(`App running on "http://localhost:${port}`);
})