const commentsModel = require("../models/comments.model");
const foodModel = require("../models/food.model"); // Aapka reel wala model

// Add a new comment
async function addComment(req, res) {
    try {
        const { foodId, text } = req.body;
        const userId = req.user._id;

        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }

        // Naya comment create karein
        const newComment = await commentsModel.create({
            user: userId,
            food: foodId,
            text: text,
        });

        await foodModel.findByIdAndUpdate(foodId, { $inc: { commentCount: 1 } });

        // Populate karke bhejein taaki frontend turant UI update kar sake
        await newComment.populate("user", "fullName username profile_pic");

        // Optional: Reel model me commentCount +1 karein (agar aapne schema me rakha hai)
        await foodModel.findByIdAndUpdate(foodId, { $inc: { comments: 1 } });

        res.status(201).json({ message: "Comment added", comment: newComment });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get comments for a specific reel
async function getComments(req, res) {
    try {
        const { foodId } = req.params;

        // Latest comments sabse pehle aayenge (.sort('-createdAt'))
        const comments = await commentsModel
            .find({ food: foodId })
            .populate("user", "fullName username profile_pic")
            .sort("-createdAt");

        res.status(200).json({ comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Delete a comment
async function deleteComment(req, res) {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        // 1. Database me comment dhundo
        const comment = await commentsModel.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // 2. Security Check: Kya ye user is comment ka owner hai?
        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You can only delete your own comments" });
        }

        // 3. Comment ko database se delete karo
        await commentsModel.findByIdAndDelete(commentId);

        // 4. Food (Reel) model me commentCount ko -1 karo
        await foodModel.findByIdAndUpdate(comment.food, { $inc: { commentCount: -1 } });

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { addComment, getComments, deleteComment };
