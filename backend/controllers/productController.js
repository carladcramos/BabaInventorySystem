const Product = require("../models/Product");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products.", error: error.message });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product by ID.", error: error.message });
  }
};

// Get distinct product categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories.", error: error.message });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  const { name, category, stock, threshold } = req.body;

  if (!name || !category || stock === undefined || threshold === undefined) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const status =
    stock > threshold ? "In Stock" : stock === 0 ? "Out of Stock" : "Low Stock";

  const newProduct = new Product({ name, category, stock, threshold, status });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: "Error adding product.", error: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  const { name, category, stock, threshold } = req.body;

  if (!name || !category || stock === undefined || threshold === undefined) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const status =
    stock > threshold ? "In Stock" : stock === 0 ? "Out of Stock" : "Low Stock";

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, stock, threshold, status },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Error updating product.", error: error.message });
  }
};

// Restock a product
exports.restockProduct = async (req, res) => {
  const { stock } = req.body;

  if (stock === undefined) {
    return res.status(400).json({ message: "Stock value is required." });
  }

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    product.stock = stock;
    product.status = stock > product.threshold ? "In Stock" : stock === 0 ? "Out of Stock" : "Low Stock";

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Error restocking product.", error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product.", error: error.message });
  }
};
