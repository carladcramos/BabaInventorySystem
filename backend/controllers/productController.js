const Product = require("../models/Product");

// Confirm an order and deduct stock
exports.confirmOrder = async (req, res) => {
  const { orderList } = req.body;

  // Check if the order list is empty
  if (!orderList || orderList.length === 0) {
    return res.status(400).json({ message: "Order list is empty." });
  }

  try {
    // Process each item in the order
    for (const item of orderList) {
      // Find the product by ID
      const product = await Product.findById(item.productId);

      // Check if the product exists
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
      }

      // Check if there is enough stock for the order
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available stock: ${product.stock}.`,
        });
      }

      // Deduct the quantity from the stock
      product.stock -= item.quantity;

      // Update the product status based on the stock level
      if (product.stock === 0) {
        product.status = "Out of Stock";
      } else if (product.stock < product.threshold) {
        product.status = "Low Stock";
      } else {
        product.status = "In Stock";
      }

      // Save the updated product back to the database
      await product.save();
    }

    // Return success response if all items processed
    res.status(200).json({ message: "Order confirmed and stock updated." });
  } catch (error) {
    console.error("Error confirming order and updating stock:", error);
    res.status(500).json({ message: "Error confirming order and updating stock.", error: error.message });
  }
};

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

  // Ensure all required fields are provided
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

  // Ensure all required fields are provided
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

  // Ensure stock is provided
  if (stock === undefined) {
    return res.status(400).json({ message: "Stock value is required." });
  }

  try {
    const product = await Product.findById(req.params.id);

    // Ensure the product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Update the product's stock and status
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
