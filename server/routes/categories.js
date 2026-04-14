const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { auth, adminOnly } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

// GET público - todas las activas
router.get("/", categoryController.getCategories);

// GET público - destacadas
router.get("/featured", categoryController.getFeaturedCategories);

// GET público - una categoría
router.get("/:slug", categoryController.getCategoryBySlug);

// Rutas admin (protegidas)
router.get("/all", auth, adminOnly, categoryController.getAllCategories);
router.post(
  "/",
  auth,
  adminOnly,
  upload.single("image"),
  categoryController.createCategory,
);
router.put(
  "/:id",
  auth,
  adminOnly,
  upload.single("image"),
  categoryController.updateCategory,
);
router.delete("/:id", auth, adminOnly, categoryController.deleteCategory);
router.patch("/:id/toggle", auth, adminOnly, categoryController.toggleCategory);

// ← NUEVO: Endpoint para destacar categoría
router.patch(
  "/:id/featured",
  auth,
  adminOnly,
  categoryController.toggleFeatured,
);

module.exports = router;
