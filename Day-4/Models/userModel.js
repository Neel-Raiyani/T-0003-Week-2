const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,

    resetToken: String,
    resetTokenExpiry: Date,

    refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
