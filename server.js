// Start the server
const app = require("./src/app");
const connectDB = require("./src/db/db");

connectDB();

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on the port ${process.env.PORT || 3000}`);
})