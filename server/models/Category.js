const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/400x400?text=Categoria",
    },
    icon: {
      type: String,
      default: "box",
      enum: [
        "droplet",
        "sun",
        "heart",
        "box",
        "package",
        "wind",
        "feather",
        "hexagon",
      ],
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    productCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Middleware para generar slug automáticamente
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // quitar acentos
      .replace(/[^a-z0-9]+/g, "-") // reemplazar espacios y caracteres especiales
      .replace(/(^-|-$)+/g, ""); // quitar guiones al inicio/final
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
