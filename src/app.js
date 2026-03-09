// Create Server
const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const authRouter = require("./routes/auth.routes");
const foodRouter = require("./routes/food.routes");
const foodPartnerRouter = require("./routes/foodPartner.routes");
const userRouter = require("./routes/user.routes");

dotenv.config();

const app = express();
app.use(cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to Zomato Reel Backend");
})

app.use("/api/auth", authRouter);
app.use("/api/food", foodRouter);
app.use("/api/food-partner", foodPartnerRouter);
app.use("/api/user", userRouter)


module.exports = app;