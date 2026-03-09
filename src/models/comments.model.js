const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Jis user ne comment kiya hai
            required: true,
        },
        food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food", // Jis reel/food par comment hua hai (Aapke schema ka actual naam use karein)
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const commentsModel = mongoose.model("Comment", commentSchema);



module.exports = commentsModel;