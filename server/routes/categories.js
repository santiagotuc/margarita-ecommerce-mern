const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { auth, adminOnly } = require("../middleware/auth");
const { upload } = require("../middleware/upload"); // ← Así debe ser

// GET público
router.get("/", categoryController.getCategories);
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

module.exports = router;
