const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    profile_pic: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    bio: {
        type: String,
        maxLength: 100 // 100 words
    },
    followings: [{ // <-- Added Array brackets here
        type: mongoose.Schema.Types.ObjectId, // Schema.Types use karna better practice hai
        ref: "FoodPartner",
    }],
    followingCount: {
        type: Number,
        default: 0
    }

},
    {
        timestamps: true
    }
)

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;