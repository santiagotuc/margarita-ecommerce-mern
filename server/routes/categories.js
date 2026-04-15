const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { auth, adminOnly } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

// GET público - todas las activas
router.get("/", categoryController.getCategories);

// GET público - destacadas
router.get("/featured", categoryController.getFeaturedCategories);

// --- TODAS LAS RUTAS ESPECÍFICAS VAN ANTES DEL /:slug ---
// Rutas admin (protegidas)
router.get("/all", auth, categoryController.getAllCategories);
router.post(
  "/",
  auth,
  upload.single("image"),
  categoryController.createCategory,
);
router.put(
  "/:id",
  auth,
  upload.single("image"),
  categoryController.updateCategory,
);
router.delete("/:id", auth, categoryController.deleteCategory);
router.patch("/:id/toggle", auth, categoryController.toggleCategory);
router.patch("/:id/featured", auth, categoryController.toggleFeatured);

// --- ESTA RUTA DEBE IR AL FINAL ---
// GET público - una categoría
router.get("/:slug", categoryController.getCategoryBySlug);

module.exports = router;
