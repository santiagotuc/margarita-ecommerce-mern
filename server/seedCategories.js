require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Category = require("./models/Category");

// Función para generar slug (copiada del schema)
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .replace(/[^a-z0-9]+/g, "-") // reemplazar espacios y caracteres especiales
    .replace(/(^-|-$)+/g, ""); // quitar guiones al inicio/final
};

const categories = [
  {
    name: "Mochilas",
    slug: "mochilas", // ← Agregado manualmente
    description: "Mochilas escolares con diseños únicos y duraderos",
    icon: "box",
    order: 1,
    image:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
  },
  {
    name: "Botellas",
    slug: "botellas", // ← Agregado manualmente
    description: "Botellas térmicas y cantimploras para mantener tus bebidas",
    icon: "droplet",
    order: 2,
    image:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
  },
  {
    name: "Kits Escolares",
    slug: "kits-escolares", // ← Agregado manualmente
    description: "Kits completos con todo lo necesario para el cole",
    icon: "package",
    order: 3,
    image:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
  },
  {
    name: "Tazas",
    slug: "tazas", // ← Agregado manualmente
    description: "Tazas personalizadas y únicas",
    icon: "sun",
    order: 4,
    image:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
  },
  {
    name: "Libretas",
    slug: "libretas", // ← Agregado manualmente
    description: "Libretas y cuadernos para todas las materias",
    icon: "feather",
    order: 5,
    image:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
  },
  {
    name: "Accesorios",
    slug: "accesorios", // ← Agregado manualmente
    description: "Accesorios escolares variados",
    icon: "heart",
    order: 6,
    image:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Limpiar categorías existentes
    await Category.deleteMany({});
    console.log("🗑️  Categorías anteriores eliminadas");

    // Insertar nuevas categorías (ahora con slugs definidos)
    await Category.insertMany(categories);
    console.log("✅ Categorías de Margarita insertadas correctamente");

    // Mostrar resumen
    const count = await Category.countDocuments();
    console.log(`📊 Total categorías: ${count}`);

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedDB();
