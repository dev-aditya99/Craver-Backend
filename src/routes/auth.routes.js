const express = require('express');
const { registerUser, loginUser, logoutUser, registerFoodPartner, loginFoodPartner, logoutFoodPartner } = require('../controllers/auth.controller');

const authRouter = express.Router();

// User Routes
authRouter.post("/user/register", registerUser)
authRouter.post("/user/login", loginUser);
authRouter.get("/user/logout", logoutUser);

// Food Partner Routes
authRouter.post("/food-partner/register", registerFoodPartner);
authRouter.post("/food-partner/login", loginFoodPartner);
authRouter.get("/food-partner/logout", logoutFoodPartner);

module.exports = authRouter;