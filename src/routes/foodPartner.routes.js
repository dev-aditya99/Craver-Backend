const express = require("express");
const {
    getFoodParnterById,
    getSelfProfile,
    updatePartnerProfile,
    updatePartnerProfilePic
} = require("../controllers/foodPartner.controller");

const { authUserMiddleware, authFoodPartnerMiddleware } = require("../middlewares/auth.middleware");
const multer = require("multer");

const foodPartnerRouter = express.Router();

// Mutler configuration for handling video uploads
const upload = multer({
    storage: multer.memoryStorage(),
})


// Get own dashboard data
foodPartnerRouter.get("/profile", authFoodPartnerMiddleware, getSelfProfile);

// Update own profile details
foodPartnerRouter.put("/update/profile", authFoodPartnerMiddleware, updatePartnerProfile);

// New Route (Must be above /:id)
foodPartnerRouter.post(
    "/update/profile/pic",
    authFoodPartnerMiddleware,
    upload.single("profile_pic"), // field ka naam 'profile_pic' hi hona chahiye
    updatePartnerProfilePic
);

// =========================================================
// PUBLIC/USER ROUTES (Must use User Auth Middleware)
// =========================================================

// Ye hamesha sabse neeche hona chahiye kyunki /:id ek wildcard hai
foodPartnerRouter.get("/:id", authUserMiddleware, getFoodParnterById);

module.exports = foodPartnerRouter;