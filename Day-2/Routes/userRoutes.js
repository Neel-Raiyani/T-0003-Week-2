const express = require('express');
const User = require('../Models/User');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Filtering and Pagination
        const {search, city, sort, order, page, limit} = req.query;

        let filter = {};

        if(city){
            filter.city = city;
        }
        
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { city: { $regex: search, $options: "i" } }
            ];
        }

        let sortOption = {};
        if (sort) {
            sortOption[sort] = order === "desc" ? -1 : 1;
        }

         const pageNum = Number(page) || 1;    // Default = page 1
        const limitNum = Number(limit) || 10; // Default = 10 docs per page
        const skip = (pageNum - 1) * limitNum;

        const users = await User.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);

        const total = await User.countDocuments(filter);

        res.json({
            total,
            page: pageNum,
            limit: limitNum,
            results: users.length,
            users
        });
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