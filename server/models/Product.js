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
      required: [true, "El SKU es obligatorio"],
      trim: true,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La categoría es obligatoria"],
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: 0,
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: 0,
      default: 0,
    },
    minStockAlert: {
      type: Number,
      default: 5,
    },
    description: {
      type: String,
      default: "",
    },
    images: [
      {
        type: String,
        required: [true, "Al menos una imagen es obligatoria"],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isWeeklyOffer: {
      type: Boolean,
      default: false,
    },
    offerDiscount: {
      type: Number,
      default: 0, // porcentaje de descuento
    },
  },
  { timestamps: true },
);

// Virtual para verificar stock bajo
productSchema.virtual("isLowStock").get(function () {
  return this.stock <= this.minStockAlert;
});

module.exports = mongoose.model("Product", productSchema);
