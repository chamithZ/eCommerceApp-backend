const express = require("express");
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getSearchSuggestions,
    getSearchResults,
} = require("../controllers/productCtrl");

// Routes
router.get('/suggestions', getSearchSuggestions);  // Specific suggestions route
router.get('/results', getSearchResults);
router.get("/", getAllProducts); // Get all products
router.get("/:id", getProductById); // Get single product
router.post("/", createProduct); // Add a new product
router.put("/:id", updateProduct); // Update a product
router.delete("/:id", deleteProduct); // Delete a product

module.exports = router;
