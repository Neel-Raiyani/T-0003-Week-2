const express = require('express');
const {body, validationResult} = require('express-validator');
const app = express();
const PORT = 3018;

// Custom Express Middleware 
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
};

app.use(express.json());

app.post('/create-user', [
    body('name').notEmpty().withMessage("Name is required"),
    body('email').isEmail().withMessage("Valid email required"),
    body('password').isLength({min: 8}).withMessage("Password must be atleast of length 8")
], validate, (req, res) => {
    res.json({message: "User created successfully!",
    data: req.body
    })
});

app.listen(PORT,() => {
    console.log(`App running on "http://localhost:${PORT}"`);
})