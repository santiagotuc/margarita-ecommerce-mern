const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      default: "website", // para saber de dónde vino
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Newsletter", newsletterSchema);
