const foodPartnerModel = require("../models/foodPartner.model");
const foodModel = require("../models/food.model")
const { v4: uuidv4 } = require('uuid');
const { uploadFile } = require("../services/storage.service");

async function getFoodParnterById(req, res) {
    try {
        const foodPartnerId = req.params.id;

        const foodPartner = await foodPartnerModel.findById(foodPartnerId).select("-password");
        const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId });

        if (!foodPartner) {
            return res.status(404).json({ message: "Food partner not found" })
        }

        res.status(200).json({
            message: "Food partner found successfully", foodPartner: {
                ...foodPartner.toObject(),
                foodItems: foodItemsByFoodPartner
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getSelfProfile(req, res) {
    try {
        // req.foodPartner auth middleware se aayega
        const partnerId = req.foodPartner._id;

        const foodPartner = await foodPartnerModel.findById(partnerId);
        const foodItemsByFoodPartner = await foodModel.find({ foodPartner: partnerId }).populate({ path: "foodPartner", select: "-password" });

        if (!foodPartner) {
            return res.status(404).json({ message: "Food partner not found" });
        }

        res.status(200).json({
            message: "Profile loaded successfully",
            foodPartner: {
                ...foodPartner.toObject(),
                foodItems: foodItemsByFoodPartner
            }
        });
    } catch (error) {
        console.error("Self Profile Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// ==========================================
// NEW: For Food Partner to Edit/Update their profile
// ==========================================
async function updatePartnerProfile(req, res) {
    try {
        const partnerId = req.foodPartner._id;
        const { name, contactName, phone, address, email, description } = req.body;

        const updateFields = {};

        if (name) updateFields.name = name;
        if (contactName) updateFields.contactName = contactName;
        if (phone) updateFields.phone = phone;
        if (address) updateFields.address = address;
        if (email) updateFields.email = email;
        if (description) updateFields.description = description;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No data provided to update" });
        }

        await foodPartnerModel.updateOne(
            { _id: partnerId },
            { $set: updateFields }
        );

        return res.status(200).json({ message: "Profile updated successfully" });

    } catch (error) {
        // Handle duplicate email/phone error
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                message: `This ${duplicateField} is already registered.`
            });
        }
        console.error("Update Profile Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


// Update Partner Profile Pic
async function updatePartnerProfilePic(req, res) {
    try {
        const profilePic = req.file;

        if (!profilePic) {
            return res.status(404).json({ message: "Image not found" });
        }

        // upload the image file to cloud storage and get the URL
        // Make sure uploadFile and uuidv4 are imported properly
        const fileUploadResult = await uploadFile(profilePic.buffer, uuidv4());

        await foodPartnerModel.updateOne(
            { _id: req.foodPartner._id },
            { profile_pic: fileUploadResult.url }
        );

        return res.status(200).json({
            message: "Store logo updated successfully",
            profilePic: fileUploadResult.url
        });
    } catch (error) {
        console.error("Partner Pic Update Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


module.exports = {
    getFoodParnterById,
    getSelfProfile,
    updatePartnerProfile,
    updatePartnerProfilePic
};

