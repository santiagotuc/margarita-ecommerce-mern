const Category = require("../models/Category");
const Product = require("../models/Product");

// Obtener todas las categorías activas (público)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      order: 1,
      name: 1,
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las categorías (admin)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una categoría por slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // Contar productos
    const count = await Product.countDocuments({ category: category._id });
    category.productCount = count;

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear categoría
exports.createCategory = async (req, res) => {
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
};

// Actualizar categoría
exports.updateCategory = async (req, res) => {
  try {
    const categoryData = req.body;

    if (req.file) {
      categoryData.image = req.file.path;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      categoryData,
      { new: true, runValidators: true },
    );

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar categoría
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // Verificar productos asociados
    const productCount = await Product.countDocuments({
      category: category._id,
    });

    if (productCount > 0) {
      return res.status(400).json({
        message: `No se puede eliminar. Hay ${productCount} productos en esta categoría.`,
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle activo/inactivo
exports.toggleCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
