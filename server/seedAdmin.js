require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");

const seedAdmin = async () => {
  try {
    await connectDB();

    // Verificar si ya existe admin
    const existingAdmin = await User.findOne({ email: "ari@margarita.com" });
    if (existingAdmin) {
      console.log("✅ Admin ya existe");
      console.log("Email: ari@margarita.com");
      console.log("Password: margarita2024");
      process.exit();
    }

    // Crear admin
    const admin = await User.create({
      firstName: "Ari",
      lastName: "Rivarola",
      email: "ari@margarita.com",
      password: "margarita2024",
      role: "admin",
    });

    console.log("✅ Admin creado exitosamente");
    console.log("Email: ari@margarita.com");
    console.log("Password: margarita2024");

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedAdmin();
