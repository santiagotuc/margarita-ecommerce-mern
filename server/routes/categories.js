const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const { auth } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

// GET /api/categories - Obtener todas las categorías
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      order: 1,
      name: 1,
    });
    res.json(categories);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
});

// GET /api/categories/all - Listar todas (incluyendo inactivas) - Admin
router.get("/all", auth, async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/categories/:slug - Obtener una categoría
router.get("/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category)
      return res.status(404).json({ message: "Categoría no encontrada" });

    // Contar productos en esta categoría
    const count = await Product.countDocuments({ category: category.slug });
    category.productCount = count;

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/categories - Crear categoría (Admin)
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const categoryData = req.body;

    if (req.file) {
      categoryData.image = req.file.path;
    }

    const category = new Category(categoryData);
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Ya existe una categoría con ese nombre" });
    }
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/categories/:id - Actualizar categoría (Admin)
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const categoryData = req.body;

    if (req.file) {
      categoryData.image = req.file.path;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      categoryData,
      { new: true },
    );

    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/categories/:id - Desactivar categoría (Admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    // Verificar si hay productos en esta categoría
    const productCount = await Product.countDocuments({
      category: req.params.slug,
    });

    if (productCount > 0) {
      return res.status(400).json({
        message: `No se puede eliminar. Hay ${productCount} productos en esta categoría.`,
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Categoría eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/categories/:id/toggle - Activar/Desactivar (Admin)
router.patch("/:id/toggle", auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    category.isActive = !category.isActive;
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
