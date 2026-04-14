const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { auth, adminOnly } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

// GET todos los productos (público)
router.get("/", async (req, res) => {
  try {
    const { category, page = 1, limit = 12, featured } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (featured) query.featured = featured === "true";

    const products = await Product.find(query)
      .populate("category", "name slug")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST crear producto (Admin)
router.post(
  "/",
  auth,
  adminOnly,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const productData = req.body;

      if (req.files && req.files.length > 0) {
        productData.images = req.files.map((file) => file.path);
      }

      const product = new Product(productData);
      await product.save();

      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
);

// PUT actualizar producto (Admin)
router.put(
  "/:id",
  auth,
  adminOnly,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const productData = req.body;

      if (req.files && req.files.length > 0) {
        productData.images = req.files.map((file) => file.path);
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        productData,
        { new: true, runValidators: true },
      );

      res.json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
);

// DELETE producto (Admin)
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
