const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { auth, adminOnly } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

// Público
router.get("/", productController.getProducts);
router.get("/all", productController.getAllProducts); // Admin también usa este
router.get("/:id", productController.getProductById);

// Admin - Crear (con hasta 5 imágenes)
router.post(
  "/",
  auth,
  adminOnly,
  upload.array("images", 5),
  productController.createProduct,
);

// Admin - Actualizar
router.put(
  "/:id",
  auth,
  adminOnly,
  upload.array("images", 5),
  productController.updateProduct,
);

// Admin - Eliminar
router.delete("/:id", auth, adminOnly, productController.deleteProduct);

// Admin - Toggle activo
router.patch("/:id/toggle", auth, adminOnly, productController.toggleActive);

// Admin - Eliminar imagen específica
router.delete(
  "/:id/image/:imageIndex",
  auth,
  adminOnly,
  productController.deleteImage,
);

module.exports = router;
