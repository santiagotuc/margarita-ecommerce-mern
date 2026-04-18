const Product = require("../models/Product");
const Category = require("../models/Category");

// Obtener todos los productos (Admin)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categories", "name slug")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener productos públicos (con filtros)
exports.getProducts = async (req, res) => {
  try {
    const {
      category, // Este es el slug o id que viene de la URL
      page = 1,
      limit = 12,
      featured,
      newArrivals,
      offer,
      search,
    } = req.query;

    const query = { isActive: true };

    // AQUI ESTABA EL ERROR: Cambiamos query.category por query.categories
    // MongoDB es inteligente: si le pasas un ID a un array (categories), buscará los productos que contengan ese ID dentro de su array.
    if (category) query.categories = category;

    if (featured === "true") query.featured = true;
    if (newArrivals === "true") query.isNewArrival = true;
    if (offer === "true") query.isWeeklyOffer = true;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query)
      .populate("categories", "name slug")
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
};

// Obtener un producto por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categories",
      "name slug",
    );

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear producto
exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Procesar imágenes de Cloudinary
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => file.path);
    } else {
      return res
        .status(400)
        .json({ message: "Debes subir al menos una imagen" });
    }

    // ASEGURARNOS DE QUE LAS CATEGORÍAS SEAN UN ARRAY
    // Cuando se envía un solo checkbox por FormData, a veces llega como String en lugar de Array.
    if (productData.categories && !Array.isArray(productData.categories)) {
      productData.categories = [productData.categories];
    }

    // Convertir strings booleanos a booleanos reales
    productData.isNewArrival =
      productData.isNewArrival === "true" || productData.isNewArrival === true;
    productData.isWeeklyOffer =
      productData.isWeeklyOffer === "true" ||
      productData.isWeeklyOffer === true;
    productData.featured =
      productData.featured === "true" || productData.featured === true;
    productData.isActive =
      productData.isActive === "true" || productData.isActive === true || true;
    // Agregamos Kit Margarita
    productData.isKitMargarita =
      productData.isKitMargarita === "true" ||
      productData.isKitMargarita === true;

    // Convertir números
    productData.price = Number(productData.price);
    productData.stock = Number(productData.stock);
    productData.offerDiscount = Number(productData.offerDiscount) || 0;
    productData.minStockAlert = Number(productData.minStockAlert) || 5;

    const product = new Product(productData);
    await product.save();

    await product.populate("categories");

    res.status(201).json({
      message: "Producto creado exitosamente",
      product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Ya existe un producto con ese SKU" });
    }
    res.status(400).json({ message: error.message });
  }
};

// Actualizar producto
exports.updateProduct = async (req, res) => {
  try {
    const productData = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Si hay nuevas imágenes, agregarlas (o reemplazar si se especifica)
    if (req.files && req.files.length > 0) {
      if (req.body.replaceImages === "true") {
        productData.images = req.files.map((file) => file.path);
      } else {
        // Agregar a las existentes
        const newImages = req.files.map((file) => file.path);
        productData.images = [...product.images, ...newImages];
      }
    }

    // ASEGURARNOS DE QUE LAS CATEGORÍAS SEAN UN ARRAY
    if (productData.categories && !Array.isArray(productData.categories)) {
      productData.categories = [productData.categories];
    }

    // Convertir tipos
    productData.isNewArrival =
      productData.isNewArrival === "true" || productData.isNewArrival === true;
    productData.isWeeklyOffer =
      productData.isWeeklyOffer === "true" ||
      productData.isWeeklyOffer === true;
    productData.featured =
      productData.featured === "true" || productData.featured === true;
    productData.isActive =
      productData.isActive === "true" || productData.isActive === true;
    // Agregamos Kit Margarita
    productData.isKitMargarita =
      productData.isKitMargarita === "true" ||
      productData.isKitMargarita === true;

    productData.price = Number(productData.price);
    productData.stock = Number(productData.stock);
    productData.offerDiscount = Number(productData.offerDiscount) || 0;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true },
    ).populate("categories");

    res.json({
      message: "Producto actualizado exitosamente",
      product: updatedProduct,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Ya existe un producto con ese SKU" });
    }
    res.status(400).json({ message: error.message });
  }
};

// Eliminar producto
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Activo/Inactivo
exports.toggleActive = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({
      message: product.isActive ? "Producto activado" : "Producto desactivado",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar imagen específica
exports.deleteImage = async (req, res) => {
  try {
    const { id, imageIndex } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (product.images.length <= 1) {
      return res
        .status(400)
        .json({ message: "El producto debe tener al menos una imagen" });
    }

    product.images.splice(imageIndex, 1);
    await product.save();

    res.json({ message: "Imagen eliminada", images: product.images });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
