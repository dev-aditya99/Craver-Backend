const mongoose = require("mongoose");

const foodPartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contactName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    profile_pic: {
        type: String,
    },
    // ---- NAYI FIELDS JO UI KE LIYE CHAHIYE ----
    description: {
        type: String, // Store ka bio/description
        maxLength: 200
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // Users jo is partner ko follow karte hain
    }],
    followerCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const foodPartnerModel = mongoose.model("FoodPartner", foodPartnerSchema);
module.exports = foodPartnerModel;