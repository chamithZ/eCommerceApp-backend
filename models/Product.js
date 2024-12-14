const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    images: [{ type: String }], // Image URLs or paths
    thumbnail: { type: String }, // Main image for thumbnail
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
