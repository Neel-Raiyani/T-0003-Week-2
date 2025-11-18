const express = require('express');
const connectDB = require('./Config/db');
//const User = require('./Models/User');
const userRoutes = require('./Routes/userRoutes');
require('dotenv').config();

const port = process.env.port || 1818;

connectDB();

const app = express();

// Custom logger middleware
const logger = (req, res, next) => {
    const method = req.method;
    const url = req.url;
    const time = new Date().toLocaleString();
    
    console.log(`[${time}] ${method} ${url}`);
    
    next();
}

app.use(express.json());
app.use(logger);

app.use('/api/users', userRoutes);

app.listen(port,() => {
    console.log(`App listening on http://localhost:${port}`)
});