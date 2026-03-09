const foodModel = require('../models/food.model');
const { v4: uuiidv4 } = require('uuid');
const { uploadFile } = require('../services/storage.service');
const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');

// Create Food
async function createFood(req, res) {
    try {
        const { name, description } = req.body;
        const foodPartner = req.foodPartner;
        const videoFile = req.file;

        if (!name || !foodPartner) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (!videoFile) {
            return res.status(400).json({ message: "Video file is required" })
        }

        if (!videoFile.mimetype.startsWith("video/")) {
            return res.status(400).json({ message: "Only video files are allowed" })
        }

        // upload the video file to cloud storage and get the URL
        const fileUploadResult = await uploadFile(videoFile.buffer, uuiidv4());

        const foodItem = await foodModel.create({
            name,
            description,
            video: fileUploadResult.url,
            foodPartner: foodPartner._id
        })

        return res.status(201).json({ message: "Food item created successfully", food: foodItem });
    } catch (error) {
        console.error("Error at createFood:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get Food Items - To be implemented for users to scroll the food items reels
async function getFoodItems(req, res) {
    try {
        const foodItems = await foodModel.find().populate("foodPartner", "name profile_pic");

        if (!foodItems || foodItems.length === 0) {
            return res.status(404).json({ message: "No food items found" });
        }

        return res.status(200).json({ foodItems });
    } catch (error) {
        console.log("Error at getFoodItems:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Like Food 
async function likeFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        if (!foodId || !user) {
            return res.status(404).json({ message: "Unable to like the reel" });
        }

        const isAlreadyLiked = await likeModel.findOne({
            user: user._id,
            food: foodId
        })

        if (isAlreadyLiked) {
            await likeModel.deleteOne({
                user: user._id,
                food: foodId
            })

            await foodModel.findByIdAndUpdate(foodId, {
                $inc: { likeCount: -1 }
            })

            return res.status(200).json({ message: "You Unlike the Food" });
        }

        const like = await likeModel.create({
            user: user._id,
            food: foodId
        })

        if (!like) {
            return res.status(401).json({ message: "Unable to like the reel" })
        }

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: 1 }
        })

        res.status(201).json({ message: "You Liked Food!", like })

    } catch (error) {
        return res.status(500).json({ message: "Error during like food controller:", error })
    }
}

// Save Food 
async function saveFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        if (!foodId || !user) {
            return res.status(404).json({ message: "Unable to save the reel" });
        }

        const isAlreadySaved = await saveModel.findOne({
            user: user._id,
            food: foodId
        })

        if (isAlreadySaved) {
            await saveModel.deleteOne({
                user: user._id,
                food: foodId
            })

            await foodModel.findByIdAndUpdate(foodId, {
                $inc: { saveCount: -1 }
            })

            return res.status(200).json({ message: "You Unsave the Food" });
        }

        const save = await saveModel.create({
            user: user._id,
            food: foodId
        })

        if (!save) {
            return res.status(401).json({ message: "Unable to save the reel" })
        }

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { saveCount: 1 }
        })

        res.status(201).json({ message: "You Saved Food!", save })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

// Get Saved Food
async function getSavedFood(req, res) {
    try {
        const user = req.user;

        const savedFoods = await saveModel.find({ user: user._id }).populate({
            path: "food",
            populate: { path: "foodPartner" }
        })

        if (!savedFoods || savedFoods.length === 0) {
            return res.status(200).json({ message: "No saved food found" });
        }

        res.status(200).json({ message: "Saved Foods Found", savedFoods });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get Shared Food Reel
const getSharedReel = async (req, res) => {
    try {
        const { reelId } = req.params;

        // Fetch reel and populate partner details
        const reel = await foodModel.findById(reelId).populate("foodPartner", "name profilePic");

        if (!reel) {
            return res.status(404).json({ message: "Reel not found or has been deleted." });
        }

        res.status(200).json({ reel });
    } catch (error) {
        console.error("Error at getSharedReel:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = { createFood, getFoodItems, likeFood, saveFood, getSavedFood, getSharedReel };