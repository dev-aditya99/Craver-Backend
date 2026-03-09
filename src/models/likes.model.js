const mongoose = require("mongoose");

const likeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true
    }
},
    {
        timestamp: true
    }
)

const likeModel = mongoose.model("Like", likeSchema);

module.exports = likeModel;