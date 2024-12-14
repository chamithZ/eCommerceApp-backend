const express = require("express");
const { registerUser, loginUser, updateFavorites } = require("../controllers/UserCtrl");
const { protect } = require("../middleware/auth");
const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Update favorites route
router.put("/favorites", protect, updateFavorites);

module.exports = router;
