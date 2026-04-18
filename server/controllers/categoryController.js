const Category = require("../models/Category");
const Product = require("../models/Product");

// Función auxiliar mágica para inyectar imágenes de productos a las categorías
const enrichCategoriesWithImages = async (categories) => {
  const enriched = [];
  for (let cat of categories) {
    const catObj = cat.toObject ? cat.toObject() : cat;

    // AQUI ESTABA EL ERROR: Cambiamos category por categories
    const products = await Product.find({
      categories: cat._id,
      images: { $exists: true, $not: { $size: 0 } },
    })
      .limit(5)
      .select("images");

    catObj.productPreviewImages = products
      .map((p) => p.images[0])
      .filter(Boolean);

    // AQUI TAMBIEN: Cambiamos category por categories
    catObj.productCount = await Product.countDocuments({ categories: cat._id });

    enriched.push(catObj);
  }
  return enriched;
};

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

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    const enrichedCategories = await enrichCategoriesWithImages(categories);
    res.json(enrichedCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    // AQUI TAMBIEN: categories
    const count = await Product.countDocuments({ categories: category._id });
    const catObj = category.toObject();
    catObj.productCount = count;

    res.json(catObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Categoría no encontrada" });

    // AQUI TAMBIEN: categories
    const productCount = await Product.countDocuments({
      categories: category._id,
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
