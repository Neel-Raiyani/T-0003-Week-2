const express = require('express');
const User = require('../Models/User');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const getUser = await User.find();
        res.json(getUser);
    } 
    catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if(!user){
            return res.status(404).json({message: "User not found!!!"});
        }

        res.status(201).json({message: "User found successfully!!!", user});
    } 
    catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.post('/create-user', async (req,res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({messsage: "User created successfully!!!", user});   

        res.json(user);
    } 
    catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.put('/update-user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        );
        if(!user){
            return res.status(404).json({message: "User not found..."});
        }

        res.json({message: "User updated successfully!!!"});
    } 
    catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.delete('/delete-user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if(!user){
            return res.status(404).json({message: "User not found..."});
        }
        res.json({message: "User deleted successfully!!!"});
    } 
    catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;