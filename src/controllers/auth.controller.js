const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const foodPartnerModel = require('../models/foodPartner.model');

// Auth User Controller
// Register User 
async function registerUser(req, res) {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const isUserExist = await userModel.findOne({ email });

        if (isUserExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            fullName,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.status(201).cookie("token", token, options).json({
            message: "User registered successfully", user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
}

// Login User
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" })
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Email or Password" })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.status(200).cookie("token", token, options).json({
            message: "User logged in successfully", user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error logging in user", error: error.message });
    }
}

// Logout User
async function logoutUser(req, res) {
    try {
        res.status(200).clearCookie("token").json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out user", error: error.message });
    }
}

// Auth Food Partner Controller
// Register Food Partner
async function registerFoodPartner(req, res) {
    try {
        const { name, email, password, contactName, phone, address } = req.body;

        if (!name || !email || !password || !contactName || !phone || !address) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const isFoodPartnerExist = await foodPartnerModel.findOne({ email });

        if (isFoodPartnerExist) {
            return res.status(400).json({ message: "Food Partner already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const foodPartner = await foodPartnerModel.create({
            name,
            email,
            password: hashedPassword,
            contactName,
            phone,
            address
        })

        const token = jwt.sign({ foodPartnerId: foodPartner._id }, process.env.JWT_SECRET);
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.status(201).cookie("token", token, options).json({
            message: "Food Partner registered successfully", foodPartner: {
                id: foodPartner._id,
                name: foodPartner.name,
                email: foodPartner.email,
                contactName: foodPartner.contactName,
                phone: foodPartner.phone,
                address: foodPartner.address
            }
        });


    } catch (error) {
        res.status(500).json({ message: "Error registering food partner", error: error.message });
    }
}

// Login Food Partner
async function loginFoodPartner(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const foodPartner = await foodPartnerModel.findOne({ email });

        if (!foodPartner) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        const token = await jwt.sign({ foodPartnerId: foodPartner._id }, process.env.JWT_SECRET);
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.status(200).cookie("token", token, options).json({
            message: "Food Partner Logged in Successfully", foodPartner: {
                id: foodPartner._id,
                name: foodPartner.name,
                email: foodPartner.email
            }
        })

    } catch (error) {
        res.status(500).json({ message: "Error logging in food partner", error: error.message });
    }
}

// Logout Food Partner
async function logoutFoodPartner(req, res) {
    try {
        res.status(200).clearCookie("token").json({ message: "Food Partner Logged out Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out food partner", error: error.message });
    }
}

module.exports = { registerUser, loginUser, logoutUser, registerFoodPartner, loginFoodPartner, logoutFoodPartner }