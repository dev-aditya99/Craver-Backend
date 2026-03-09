const mongoose = require("mongoose");

function connectDB() {
    mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log("MongoDB Connected!");
    }).catch((err) => {
        console.log("MongoDB Connection Error:", err);
    })
}

module.exports = connectDB;