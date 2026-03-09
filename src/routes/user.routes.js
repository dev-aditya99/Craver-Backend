const express = require('express');
const { authUserMiddleware } = require('../middlewares/auth.middleware');

const multer = require('multer');
const { updateUserProfilePic, getUserProfilePic, getUserDetails, updateUserEmail, updateUserProfileDetails, toggleFollowPartner, getUserFollowings } = require('../controllers/user.controller');

const userRouter = express.Router();

// Mutler configuration for handling image uploads
const upload = multer({
    storage: multer.memoryStorage(),
})

// Update user profile pic route | Protected Route
userRouter.put('/update/profile/pic', authUserMiddleware, upload.single("profile_pic"), updateUserProfilePic);

// Get user profile pic route | Protected Route
userRouter.get('/update/profile/pic', authUserMiddleware, getUserProfilePic);

// Example user routes
userRouter.put('/update/profile/details', authUserMiddleware, updateUserProfileDetails);
userRouter.put('/update/profile/email', authUserMiddleware, updateUserEmail);

// Get user details route | Protected Route
userRouter.get('/profile', authUserMiddleware, getUserDetails);

// Follow the Food Partner 
userRouter.post('/follow', authUserMiddleware, toggleFollowPartner);

userRouter.get('/followings', authUserMiddleware, getUserFollowings);

module.exports = userRouter;