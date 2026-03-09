const userModel = require('../models/user.model');
const { v4: uuiidv4 } = require('uuid');

const { uploadFile } = require('../services/storage.service');

// Update User Profile Pic 
async function updateUserProfilePic(req, res) {
    try {
        const profilePic = req.file;

        if (!profilePic) {
            return res.status(404).json({ message: "Image not found" });
        }

        // upload the image file to cloud storage and get the URL
        const fileUploadResult = await uploadFile(profilePic.buffer, uuiidv4());

        const userProfilePic = await userModel.updateOne({ _id: req.user._id }, {
            profile_pic: fileUploadResult.url
        });

        return res.status(200).json({ message: "Profile Pic Updated successfully", profilePic: fileUploadResult.url });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// 1. Update Basic Profile Details (FullName, Username, Bio)
async function updateUserProfileDetails(req, res) {
    try {
        const { fullName, username, bio } = req.body;

        const updateFields = {};

        // Use fullName according to your schema
        if (fullName) updateFields.fullName = fullName;
        if (username) updateFields.username = username;

        // Bio can be cleared (empty string), so we strictly check for undefined
        if (bio !== undefined) updateFields.bio = bio;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No data provided to update" });
        }

        await userModel.updateOne(
            { _id: req.user._id },
            { $set: updateFields }
        );

        return res.status(200).json({
            message: "Profile details updated successfully",
            updatedData: updateFields
        });

    } catch (error) {
        // Handle unique constraint error for username
        if (error.code === 11000 && error.keyPattern?.username) {
            return res.status(400).json({
                message: "This username is already taken. Please try another."
            });
        }

        console.error("Profile Update Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


// 2. Update User Email Separately
async function updateUserEmail(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // You can also add basic regex email validation here if you want

        await userModel.updateOne(
            { _id: req.user._id },
            { $set: { email: email } }
        );

        return res.status(200).json({
            message: "Email updated successfully",
            email: email
        });

    } catch (error) {
        // Handle unique constraint error for email
        if (error.code === 11000 && error.keyPattern?.email) {
            return res.status(400).json({
                message: "This email is already registered to another account."
            });
        }

        console.error("Email Update Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


// Get User Profile Pic 
async function getUserProfilePic(req, res) {
    try {
        const userId = req.user._id;

        if (!userId) {
            return res.status(404).json({ message: "Unauthorized User" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Invalid User" });
        }


        return res.status(200).json({ message: "Profile Pic Found", profilePic: user?.profile_pic });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get User Profile Pic 
async function getUserDetails(req, res) {
    try {
        const userId = req.user._id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized User" });
        }

        const user = await userModel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }


        return res.status(200).json({ message: "User Found", user: user });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function toggleFollowPartner(req, res) {
    try {
        const userId = req.user._id; // JWT se aayega
        const { partnerId } = req.body; // Frontend se aayega kisko follow karna hai

        if (!partnerId) {
            return res.status(400).json({ message: "Partner ID is required" });
        }

        // User ko database me dhundho
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check karo ki kya user pehle se is partner ko follow kar raha hai
        const isAlreadyFollowing = user.followings.includes(partnerId);

        if (isAlreadyFollowing) {
            // =========================
            // UNFOLLOW LOGIC
            // =========================
            // $pull array me se id hata dega, $inc count ko -1 kar dega
            await userModel.findByIdAndUpdate(userId, {
                $pull: { followings: partnerId },
                $inc: { followingCount: -1 }
            });

            // Optional but Recommended: FoodPartner ka followerCount bhi -1 kardo
            // await foodPartnerModel.findByIdAndUpdate(partnerId, { $inc: { followerCount: -1 } });

            return res.status(200).json({
                message: "Unfollowed successfully",
                isFollowing: false
            });

        } else {
            // =========================
            // FOLLOW LOGIC
            // =========================
            // $addToSet array me id daal dega (duplicates prevent karta hai), $inc count ko +1 kar dega
            await userModel.findByIdAndUpdate(userId, {
                $addToSet: { followings: partnerId },
                $inc: { followingCount: 1 }
            });

            // Optional but Recommended: FoodPartner ka followerCount bhi +1 kardo
            // await foodPartnerModel.findByIdAndUpdate(partnerId, { $inc: { followerCount: 1 } });

            return res.status(200).json({
                message: "Followed successfully",
                isFollowing: true
            });
        }

    } catch (error) {
        console.error("Error in toggleFollowPartner:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get User Followings List
async function getUserFollowings(req, res) {
    try {
        // Find the user and populate the 'followings' array to get actual partner details
        // We only select the fields we need to keep the payload light
        const user = await userModel.findById(req.user._id).populate({
            path: 'followings',
            select: 'name profilePic email' // FoodPartner model ke fields
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Followings fetched successfully",
            followings: user.followings
        });

    } catch (error) {
        console.error("Error fetching followings:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


module.exports = { updateUserProfilePic, getUserProfilePic, getUserDetails, updateUserProfileDetails, updateUserEmail, toggleFollowPartner, getUserFollowings }