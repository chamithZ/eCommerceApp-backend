const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const userRoutes=require("./routes/userRoutes")
const cors = require("cors");
const path = require('path');
dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB

const app = express();


// Middleware
app.use(express.json()); // Parse JSON request bodies
// Enable CORS
app.use(cors({
    origin: "http://localhost:3000", // Allow frontend origin
}));

// Routes
app.use("/api/products", productRoutes); // Product-related routes
app.use("/api/users", userRoutes); // Product-related routes

// Error handling middleware (optional)
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

app.use("/api/products/images", express.static(path.join(__dirname, "images")));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
