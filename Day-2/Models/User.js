const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    city: String,
    phone: Number
})

const User = mongoose.model("user", userSchema);

module.exports = User;