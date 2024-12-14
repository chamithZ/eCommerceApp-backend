const Product = require("../models/Product");
const fs = require('fs');
const path = require('path');
const multer = require('multer');


// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single product
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');  // Save images in 'images' folder
  },
  filename: (req, file, cb) => {
    // Create a unique filename based on timestamp and original file extension
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error("Only image files are allowed!"));
      }
      cb(null, true);
    },
  }).array('images', 10);

const createProduct = async (req, res) => {
    try {
      // Handle file upload
      upload(req, res, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error uploading images", error: err.message });
        }
  
        // Extract file paths
        const allImages = req.files.map((file) => file.filename); // Collect all filenames
        const thumbnail = allImages.length > 0 ? allImages[0] : null; // Use the first image as the thumbnail
  
        // Create a new product
        const newProduct = new Product({
          sku: req.body.sku,
          name: req.body.name,
          description: req.body.description,
          quantity: req.body.quantity,
          images: allImages, // Save all image filenames
          thumbnail: thumbnail, // Save the first image as the thumbnail
        });
  
        // Save to the database
        await newProduct.save();
  
        res.status(201).json({ message: "Product created successfully", product: newProduct });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };
  
  const updateProduct = async (req, res) => {
    try {
      const { name, sku, description, quantity, images, thumbnail } = req.body;
  
      // Log incoming data
      console.log('Update Product Data:', { name, sku, description, quantity, images, thumbnail });
  
      const updatedProductData = {
        name,
        sku,
        description,
        quantity,
        images,
        thumbnail,
      };
  
      // Perform the update
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedProductData, { new: true });
  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Log updated product
      console.log('Updated Product:', updatedProduct);
  
      // Send the response
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: error.message });
    }
  };
  
  
  
// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSearchSuggestions = async (req, res) => {
    const query = req.query.q; // This captures the "q" query parameter
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }
  
    try {
      // Search for product names that match the query
      const suggestions = await Product.find({
        name: { $regex: query, $options: 'i' }, // Case-insensitive search
      }).limit(10); // Limit the number of results to 10
  
      // Extract product names from the results
      const suggestionNames = suggestions.map(item => item.name);
      res.json(suggestionNames); // Return the suggestions as a JSON array
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
  };
  

  // Controller to fetch search results
const getSearchResults = async (req, res) => {
    const query = req.query.q; // User input
    try {
      if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Query parameter is required' });
      }
      
      const results = await Product.find({
        name: { $regex: query, $options: 'i' }, // Case-insensitive match
      });
  
      res.status(200).json(results); // Return full product details as search results
    } catch (error) {
      console.error('Error fetching search results:', error);
      res.status(500).json({ error: 'Failed to fetch search results' });
    }
  };

  

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getSearchSuggestions,
    getSearchResults
};
