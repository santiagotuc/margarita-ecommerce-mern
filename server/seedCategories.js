const mongoose = require("mongoose");
const Category = require("./models/Category");
require("dotenv").config();

const categories = [
  {
    name: "Jabones",
    description: "Insumos para jabonería artesanal",
    icon: "droplet",
    order: 1,
  },
  {
    name: "Velas",
    description: "Ceras, pabilos y moldes para velas",
    icon: "sun",
    order: 2,
  },
  {
    name: "Cosmética",
    description: "Ingredientes naturales para cosmética",
    icon: "heart",
    order: 3,
  },
  {
    name: "Moldes",
    description: "Moldes de silicona y plástico",
    icon: "box",
    order: 4,
  },
  {
    name: "Envases",
    description: "Frascos, potes y envases",
    icon: "package",
    order: 5,
  },
  {
    name: "Flores Secas",
    description: "Flores naturales secas para decoración",
    icon: "wind",
    order: 6,
  },
  {
    name: "Kits",
    description: "Kits completos para principiantes",
    icon: "feather",
    order: 7,
  },
  {
    name: "Madera",
    description: "Artesanías en madera",
    icon: "hexagon",
    order: 8,
  },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    // Limpiar categorías existentes
    await Category.deleteMany({});
    console.log("🗑️ Categorías anteriores eliminadas");

    // Insertar nuevas categorías
    await Category.insertMany(categories);
    console.log(`✅ ${categories.length} categorías creadas`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedCategories();
