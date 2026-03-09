const express = require('express');
const { authFoodPartnerMiddleware, authUserMiddleware } = require('../middlewares/auth.middleware');
const { createFood, getFoodItems, likeFood, saveFood, getSavedFood, getSharedReel } = require('../controllers/food.controller');
const multer = require('multer');
const { addComment, getComments, deleteComment } = require('../controllers/comments.controller');

const foodRouter = express.Router();

// Mutler configuration for handling video uploads
const upload = multer({
    storage: multer.memoryStorage(),
})

// Create Food Route | Protected Route for Food Partners
foodRouter.post('/', authFoodPartnerMiddleware, upload.single("video"), createFood)

// Get Food Items Route | Public Route | Protected Route 
foodRouter.get("/", authUserMiddleware, getFoodItems);


// Like Route 
foodRouter.post("/like", authUserMiddleware, likeFood);

// Save Food Route
foodRouter.post("/save", authUserMiddleware, saveFood)

// Get Saved Food Route
foodRouter.get("/save", authUserMiddleware, getSavedFood);

// Post a comment (Auth required)
foodRouter.post("/comment", authUserMiddleware, addComment);

// Get comments (Auth check optional, usually public)
foodRouter.get("/:foodId/comments", getComments);

// Delete Comment 
foodRouter.delete("/comment/:commentId", authUserMiddleware, deleteComment);

// Get Shared Reel 
foodRouter.get("/shared/:reelId", getSharedReel);

module.exports = foodRouter;