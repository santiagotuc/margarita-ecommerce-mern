const Category = require("../models/Category");
const Product = require("../models/Product");

// Función auxiliar mágica para inyectar imágenes de productos a las categorías
const enrichCategoriesWithImages = async (categories) => {
  const enriched = [];
  for (let cat of categories) {
    const catObj = cat.toObject ? cat.toObject() : cat;

    // Buscar hasta 5 productos de esta categoría para el slideshow
    const products = await Product.find({
      category: cat._id,
      images: { $exists: true, $not: { $size: 0 } },
    })
      .limit(5)
      .select("images");

    // Extraer solo la primera imagen de cada producto encontrado
    catObj.productPreviewImages = products
      .map((p) => p.images[0])
      .filter(Boolean);
    catObj.productCount = await Product.countDocuments({ category: cat._id });

    enriched.push(catObj);
  }
  return enriched;
};

// Obtener todas las categorías activas (público)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      order: 1,
      name: 1,
    });
    const enrichedCategories = await enrichCategoriesWithImages(categories);
    res.json(enrichedCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las categorías (Admin)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    const enrichedCategories = await enrichCategoriesWithImages(categories);
    res.json(enrichedCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener categorías destacadas
exports.getFeaturedCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true, featured: true })
      .sort({ featuredOrder: 1, name: 1 })
      .limit(4);
    const enrichedCategories = await enrichCategoriesWithImages(categories);
    res.json(enrichedCategories);
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
    const count = await Product.countDocuments({ category: category._id });
    const catObj = category.toObject();
    catObj.productCount = count;

    res.json(catObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear categoría
exports.createCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    const category = new Category(categoryData);
    await category.save();

    res.status(201).json({
      message: "Categoría creada exitosamente",
      category,
    });
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
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      categoryData,
      { new: true, runValidators: true },
    );

    if (!category)
      return res.status(404).json({ message: "Categoría no encontrada" });

    res.json({ message: "Categoría actualizada", category });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar categoría
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Categoría no encontrada" });

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
    if (!category)
      return res.status(404).json({ message: "Categoría no encontrada" });

    category.isActive = !category.isActive;
    await category.save();

    res.json({
      message: category.isActive
        ? "Categoría activada"
        : "Categoría desactivada",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle destacado
exports.toggleFeatured = async (req, res) => {
  try {
    const { featured, featuredOrder } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Categoría no encontrada" });

    category.featured = featured;
    if (featured) {
      category.featuredOrder = featuredOrder || 0;
    } else {
      category.featuredOrder = 0;
    }

    await category.save();
    res.json({
      message: featured
        ? "Categoría destacada"
        : "Categoría quitada de destacados",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
