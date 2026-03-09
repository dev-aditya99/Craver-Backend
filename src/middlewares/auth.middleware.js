const foodPartnerModel = require('../models/foodPartner.model');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Food Partner Auth Middleware
async function authFoodPartnerMiddleware(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized Access" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foodPartner = await foodPartnerModel.findById(decoded.foodPartnerId);

        if (!foodPartner) {
            return res.status(401).json({ message: "Unauthorized Action" })
        }

        req.foodPartner = foodPartner;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
}

// User Auth Middleware - To be implemented for user-specific routes
async function authUserMiddleware(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized Access" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized Action" })
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = { authFoodPartnerMiddleware, authUserMiddleware };