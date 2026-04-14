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
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
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
      default: 0,
      min: 0,
      max: 100,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Virtual para verificar stock bajo
productSchema.virtual("isLowStock").get(function () {
  return this.stock <= this.minStockAlert;
});

// Virtual para precio con descuento
productSchema.virtual("finalPrice").get(function () {
  if (this.isWeeklyOffer && this.offerDiscount > 0) {
    return this.price - (this.price * this.offerDiscount) / 100;
  }
  return this.price;
});

module.exports = mongoose.model("Product", productSchema);
