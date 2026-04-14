const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
    },

    sku: {
      type: String,
      required: [true, "El SKU del producto es obligatorio"],
      trim: true,
      unique: true,
    },

    category: {
      type: String,
      required: [true, "La categoría del producto es obligatoria"],
      enum: ["Mochilas", "Botellas", "Kits", "Tazas", "Libretas", "Accesorios"],
    },
    price: {
      type: Number,
      required: [true, "El precio del producto es obligatorio"],
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, "El stock del producto es obligatorio"],
    },

    minStockAlert: {
      type: Number,
      default: 5,
    },

    imageUrl: {
      type: String,
      required: [true, "La URL de la imagen del producto es obligatoria"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
